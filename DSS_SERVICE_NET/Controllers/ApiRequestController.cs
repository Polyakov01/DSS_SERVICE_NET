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
using System.IO;
using System.Text;
using System.Net.Http.Headers;
using Newtonsoft.Json;

namespace MvcApplication1.Controllers
{
    public class ApiRequestController : DSSApiController
    {
        
        public object Get()
        {            
            String address = getPostParams("address");
            String username = getPostParams("username");
            String token = getPostParams("token");
            String test = getPostParams("items_per_page");
            try
            {
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                HttpWebRequest httpWebRequest = HttpWebRequest.CreateHttp(address.Remove(0,1).Remove(address.Length-2,1));
                String encoded = System.Convert.ToBase64String(System.Text.Encoding.GetEncoding("ISO-8859-1").GetBytes(username + ":" + token));
                httpWebRequest.Headers.Add("Authorization: Basic " + encoded);
                WebResponse myWebResponse = httpWebRequest.GetResponse();
                Stream responseStream = myWebResponse.GetResponseStream();
                StreamReader myStreamReader = new StreamReader(responseStream, Encoding.Default);
                string pageContent = myStreamReader.ReadToEnd();
                responseStream.Close();
                myWebResponse.Close();
                return JsonConvert.DeserializeObject<object>(pageContent);
            }
            catch (Exception ex)
            {
                return new DSS_RESPONSE_ERROR(ex.Message);
            }
            /* 
             String username = "leadgen@iqos.kz";
             String token = "NX25d03Y2Azw25i37kW421EiE6UjCe45";
              String rootElement = "users";
            Dictionary<string,object> values = JsonConvert.DeserializeObject<Dictionary<string,object>>(pageContent);
             String sqlQuery = "";
             if (values[rootElement].ToString().Substring(0, 1).Equals("["))
             {
                 List<Dictionary<string, object>> items = JsonConvert.DeserializeObject<List<Dictionary<string, object>>>(values[rootElement].ToString());                
                 items.ForEach(delegate(Dictionary<string, object> item)
                     {
                         String sqlFields = "insert into (";
                         String sqlValues = "values (";
                         foreach (KeyValuePair<string, object> entry in item)
                         {
                             sqlValues += "'" + entry.Value + "',";
                             sqlFields += entry.Key + ",";
                         }
                         sqlQuery += sqlFields + ") " + sqlValues + "); \n";
                     });
             }
             else
             {
                 Dictionary<string, object> items = JsonConvert.DeserializeObject<Dictionary<string, object>>(values["params"].ToString());
             }*/

                                                                 
        }
    }
}