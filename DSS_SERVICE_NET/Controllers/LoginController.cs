using MvcApplication1.classes;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.UI.WebControls;
using Kaliko;

namespace MvcApplication1.Controllers
{
    public class LoginController : DSSApiController
    {
        
        public DSS_RESPONSE Post()
        {            
            String login = getPostParams("login");
            String password = getPostParams("password");
            int useCode;            
            try 
            {
                DBOperations dbo = new DBOperations();                
                string use_code_result = dbo.doQueryString(string.Format("SELECT USE_CODE FROM VIEW_AUTHENTICATION WHERE USE_LOGIN = '{0}' AND USE_PASSWORD = '{1}'", DBOperations.SqlSafeFieldValue(login), DBOperations.SqlSafeFieldValue(password)), "USE_CODE");
                if (use_code_result.Length > 0)
                {
                    useCode = int.Parse(use_code_result);
                    return new DSS_RESPONSE_TOKEN(TokenManager.setTokenLogin(useCode));                 
                }
                else
                {             
                    throw new System.Exception("Incorrect login or password");
                }    
            } 
            catch (Exception ex) 
            {
                Logger.Write(ex,Logger.Severity.Critical);
                return new DSS_RESPONSE_ERROR(ex.Message);
            }                                             
        }
    }
}