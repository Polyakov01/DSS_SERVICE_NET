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

namespace MvcApplication1.Controllers
{
    public class ExecQueryController : DSSApiController
    {
        public DSS_RESPONSE Post()
        {            
            try
            {           
                if (TokenManager.checkToken(getPostParams("token")))
                {
                    return new DSS_RESPONSE_QUERY(new DBOperations().doQueryJSON(getPostParams("query")));         
                }
                else
                {
                    throw new Exception("token expired");
                }
            }
            catch (Exception ex)
            {
                return new DSS_RESPONSE_ERROR(ex.Message);
            }            
        }
    }
}