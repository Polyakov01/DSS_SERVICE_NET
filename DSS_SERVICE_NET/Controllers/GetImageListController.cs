using MvcApplication1.classes;
using Newtonsoft.Json.Linq;
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
    public class GetImageListController : DSSApiController
    {
        public DSS_RESPONSE Post()
        {
            try
            {                   
                return new DSS_RESPONSE_QUERY(System.IO.Directory
                                .GetFiles(ConfigurationManager.AppSettings["imagePath"]+getPostParams("folder"), getPostParams("searchPattern"))
                                .Select(Path.GetFileName)
                                .ToList<string>()
                                .ConvertAll<FileList>(x => new FileList { file = x }));
            }
            catch (Exception e)
            {
                return new DSS_RESPONSE_ERROR(e.Message);
            }
        }
    }
}