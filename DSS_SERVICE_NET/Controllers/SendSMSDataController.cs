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
    public class SendSMSController : DSSApiController
    {
        public DSS_RESPONSE Post()
        {            
            try
            {
                String message = getPostParams("message");
                String phone = getPostParams("phone");
                var response = "";
                using (var webClient = new WebClient())
                {
                    response = webClient.DownloadString(SystemPath.getSMSUrl(phone, message));
                    if (response.Contains("OK"))
                    {
                        return new DSS_RESPONSE(true);
                    }
                    else
                    {
                        throw new Exception(response);
                    }
                }

                
            }
            catch (Exception ex)
            {
                return new DSS_RESPONSE_ERROR(ex.Message);
            }
 
               
            
        }
    }
}