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
    public class UpdateDataController : DSSApiController
    {
        public DSS_RESPONSE Post()
        {
            try
            {
                new DBOperations().doBatchUpdate(
                                updatePrepare(getPostParams("fields"), 
                                DBOperations.SqlSafeFieldValue(getPostParams("table")), 
                                getPostParams("where"), getPostParams("token"))
                            );
                return new DSS_RESPONSE(true);
            }
            catch (Exception e)
            {
                return new DSS_RESPONSE_ERROR(e.Message);
            }
        }
    }
}