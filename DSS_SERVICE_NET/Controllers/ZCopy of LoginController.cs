using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace MvcApplication1.Controllers
{
    public class CopyLoginController : ApiController
    {
        // GET api/values
        public string Get([FromUri] int id, [FromUri] int id2)
        {
            int values = int.Parse(HttpContext.Current.Request.Params["id4"]);
            return (id + id2+values).ToString();
        }

        public string Post([FromUri] int Operation)
        {
            int values = int.Parse(HttpContext.Current.Request.Params["id4"]);
            return ( values).ToString();
        }
   
        // PUT api/values/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        public void Delete(int id)
        {
        }
    }
}