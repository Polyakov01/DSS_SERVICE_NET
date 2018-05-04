using MvcApplication1.classes;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.UI.WebControls;

namespace MvcApplication1.Controllers
{
    public class RecieveSMSController : DSSApiController
    {
        public DSS_RESPONSE Post()
        {            
            try
            {
                String message = getPostParams("mes");
                String phone = getPostParams("phone");
                new DBOperations().doInsert(String.Format("insert into TMP_SMS_ANSWERS (SMA_PHONE,SMA_MES) VALUES ('{0}','{1}')",phone,message));
                return new DSS_RESPONSE(true);                
            }
            catch (Exception ex)
            {                
                return new DSS_RESPONSE_ERROR(ex.Message);
            }
        }
        
    }
}