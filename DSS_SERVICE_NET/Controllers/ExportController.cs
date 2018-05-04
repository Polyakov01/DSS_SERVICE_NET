
using MvcApplication1.classes;
using Newtonsoft.Json.Linq;
using NPOI;
using NPOI.HSSF.UserModel;
using NPOI.SS.Util;
using NPOI.XSSF.UserModel;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Configuration;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.UI.WebControls;

namespace MvcApplication1.Controllers
{
    public class ExportController : DSSApiController
    {

       

        public DSS_RESPONSE Post()
        {
            try
            {
                    String token = getPostParams("token");
                    String table = getPostParams("table");
                    String where = getPostParams("where");
                    String order = getPostParams("order");
                    String reportCode = getPostParams("report_code");
                    String reportType;
                    int useCode;
                    DBOperations dbo = new DBOperations();
                    if (TokenManager.checkToken(token, out useCode))
                    {
                        if (String.IsNullOrEmpty(reportCode))
                        {
                            return new DSS_RESPONSE_URL(
                                        doCSVExport(table, where, dbo, useCode.ToString()));
                        }
                        else
                        {
                            List<String> str = dbo.doQueryString("select REP_METHOD, REP_VIEW_NAME,REP_CODE from ST_REPORTS WHERE REP_CODE = '" + reportCode + "'", "REP_METHOD", "REP_VIEW_NAME", "REP_CODE");
                            if (str.Count == 3)
                            {
                                reportType = str[0];
                                table = str[1];
                                switch (reportType)
                                {
                                    case "CSV":
                                        return new DSS_RESPONSE_URL(doCSVExport(table, where, dbo, useCode.ToString()));
                                    case "CONNECTION":
                                        return new DSS_RESPONSE_URL(SystemPath.getReportTemplateUrl(table+".xlsm"));
                                    case "HASH":
                                        String fileName = table + DateTime.Now.ToString("_yyyy_MM_dd_HH_mm_ss") + ".xlsm";
                                        where = where.Replace("'", "''");
                                        String hashname = dbo.doQueryString("exec REPORT_REGISTER_IN_CATALOG @IN_TABLE = '"+table+"', @IN_WHERE_CLAUSE = '"+where+"', @IN_LIMIT_CLAUSE  = '', @IN_ORDER_BY = '"+order+"', @IN_USE_CODE = '"+useCode+"'", "HASHNAME");
                                        ExcelWorkbook workbook = new ExcelWorkbook(new FileInfo(SystemPath.getReportTemplateFolder(table + ".xlsm")));
                                        workbook.setHash(hashname);
                                        workbook.writeFile(SystemPath.getReportCompleteFolder(fileName, useCode.ToString()));
                                        
                                    
                                        /*using (FileStream fs = new FileStream(SystemPath.getReportTemplateFolder(table + ".xlsm"), FileMode.Open))
                                        {
                                            XSSFWorkbook workbook = new XSSFWorkbook(fs);
                                            workbook.GetProperties().ExtendedProperties.GetUnderlyingProperties().Company = hashname;
                                            workbook.PivotTables[0].GetPivotCacheDefinition().GetCTPivotCacheDefInition().upgradeOnRefresh = false;
                                            //AreaReference pivotArea = new AreaReference(pivotTable.getPivotCacheDefinition().
                                             //   getCTPivotCacheDefinition().getCacheSource().getWorksheetSource().getRef());
                                            
                                            using (FileStream fso = new FileStream(SystemPath.getReportCompleteFolder(fileName, useCode.ToString()), FileMode.CreateNew))
                                            {
                                                workbook.Write(fso);
                                                workbook.Close();
                                                fso.Close();
                                            }
                                            fs.Close();                                            
                                        }   */                                 
                                         
                                        /*workbook.GetProperties().ExtendedProperties.GetUnderlyingProperties().Company = hashname;
                                            try
                                            {
                                                using (FileStream fs = new FileStream(SystemPath.getReportCompleteFolder(fileName, useCode.ToString()), FileMode.CreateNew))
                                                {
                                                    workbook.Write(fs);
                                                    fs.Close();
                                                    workbook.Close();
                                                }
                                            }
                                            finally
                                            {
                                                workbook.Close();
                                                System.GC.Collect();
                                            }     */                                               
                                        return new DSS_RESPONSE_URL(SystemPath.getReportCompleteUrl(fileName, useCode.ToString()));                                                                             
                                    default:
                                        throw new Exception("Unknown report type " + reportType + ", report code = " + reportCode);
                                }
                            }
                            else
                            {
                                throw new Exception("Cannot get report");
                            }
                        }
                        
                    }
                    else
                    {
                        throw new Exception("token expired");
                    }                                         
            }
            catch (Exception e)
            {
                return new DSS_RESPONSE_ERROR(e.Message);
            }
        }
        
        private String doCSVExport(String table, String where, DBOperations dbo, String useCode)
        {
            where = where.Replace("'", "''");
            String query = "EXEC REPORT_VIEW_EXPORT  @IN_WHERE_CLAUSE = '" + where + "',@IN_VIEW_NAME = '" + table + "' ,@IN_USE_CODE = '" + useCode + "'";
            String fileName = useCode + "_" + table + "_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".csv";
            return SystemPath.getReportCompleteUrl(
                        dbo.doQueryCSVFile(SystemPath.getReportCompleteFolder(fileName, useCode), query)
                        .Name
                        , useCode
                    );
        }
    }
}