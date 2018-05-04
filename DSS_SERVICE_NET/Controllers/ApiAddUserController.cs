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
    public class ApiAddUserController : DSSApiController
    {
        
        public object Get()
        {            
           // String address = getPostParams("address");
            String username = getPostParams("username");
            String token = getPostParams("token");
            
  
           // String test = getPostParams("items_per_page");
            try
            {
                //{"email":"mikhail@smartex.kz","user_type":"C","company_id":"1","status":"A","password":"e10adc3949ba59abbe56e057f20f883e","user_login":"mikhail@smartex.kz"}
                //address.Remove(0,1).Remove(address.Length-2,1)
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                HttpWebRequest httpWebRequest = HttpWebRequest.CreateHttp("https://preprod.iqos.kz/api/users");
                httpWebRequest.Method = "POST";
                httpWebRequest.ContentType = "application/json";
                String encoded = System.Convert.ToBase64String(System.Text.Encoding.GetEncoding("ISO-8859-1").GetBytes(username + ":" + token));                
                httpWebRequest.Headers.Add("Authorization: Basic " + encoded);

                User u = new User("234@432.kz", "password", "mail@mail.ru", "RU", "FirstName", "lastName", "1979-02-02", "77078248238", "", "Alamty");


                using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
                {

                    string json = JsonConvert.SerializeObject(u); //"{\"email\":\"mikhail@smartex2.kz\",\"user_type\":\"C\",\"company_id\":\"1\",\"status\":\"A\",\"password\":\"e10adc3949ba59abbe56e057f20f883e\",\"user_login\":\"77078248238\",\"lang_code\":\"ru\"}";
                    streamWriter.Write(json);
                    streamWriter.Flush();
                    streamWriter.Close();
                }
                var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
                using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
                {
                    var result = streamReader.ReadToEnd();
                    return JsonConvert.DeserializeObject<object>(result);
                }                
            }
            catch (WebException ex)
            {
                using (var streamReader = new StreamReader(ex.Response.GetResponseStream()))
                {
                    var result = streamReader.ReadToEnd();
                    return JsonConvert.DeserializeObject<object>(result);
                }  
                
               // return new DSS_RESPONSE_ERROR(ex.Message);
            }                                                      
        }
    }
}