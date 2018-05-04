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
    public class RelocateController : DSSApiController
    {
        public DSS_RESPONSE Post()
        {            
            try
            {
                String query = "SELECT a.* "
                                +" FROM AT_APP_RELOCATE a "
                                + " where AAR_HASH = '" + getPostParams("hash", true) + "'; Delete from AT_APP_RELOCATE where  AAR_HASH = '" + getPostParams("hash", true) + "';";                            
                return new DSS_RESPONSE_QUERY(new DBOperations().doQueryJSON(query));         
            }
            catch (Exception ex)
            {
                return new DSS_RESPONSE_ERROR(ex.Message);
            }
 
               
            
        }
    }
}