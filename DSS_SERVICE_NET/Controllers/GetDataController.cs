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
    public class GetDataController : DSSApiController
    {
        public DSS_RESPONSE Post()
        {            
            try
            {           
                String query = queryPrepare(
                            getPostParams("fields"), 
                            getPostParams("table"), 
                            getPostParams("where"), 
                            getPostParams("token"), 
                            getPostParams("order"), 
                            getPostParams("start"), 
                            getPostParams("end")
                            );
                return new DSS_RESPONSE_QUERY(new DBOperations().doQueryJSON(query));         
            }
            catch (Exception ex)
            {
                return new DSS_RESPONSE_ERROR(ex.Message);
            }
 
               
            
        }
    }
}