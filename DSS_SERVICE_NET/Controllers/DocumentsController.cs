using MvcApplication1.classes;
using System;
using System.Collections.Generic;
using System.Net;
using System.IO;
using Newtonsoft.Json;
using System.Threading;
using System.Web;
using MvcApplication1.classes.entity;

namespace MvcApplication1.Controllers
{
    public class DocumentsController : DSSApiController
    {
        public object Get()
        {
            /*
            // String address = getPostParams("address");
            String username = getPostParams("username");
            String token = getPostParams("token");


            List<string> json = new DBOperations().doQueryString("SELECT * from GetJSONList(DEFAULT)", "result", "row_code", "rowid");
          //  while (json.Count > 1)
            {
                json = new DBOperations().doQueryString("SELECT * from GetJSONList(DEFAULT)", "result", "row_code", "rowid");
                // String test = getPostParams("items_per_page");
                if (json[0].Length > 10)
                {
                    try
                    {
                        // http://localhost:57484/api/ApiPOSTRequest?username=leadgen@iqos.kz&token=NX25d03Y2Azw25i37kW421EiE6UjCe45
                        //{"email":"mikhail@smartex.kz","user_type":"C","company_id":"1","status":"A","password":"e10adc3949ba59abbe56e057f20f883e","user_login":"mikhail@smartex.kz"}
                        //address.Remove(0,1).Remove(address.Length-2,1)
                        ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
                        HttpWebRequest httpWebRequest = HttpWebRequest.CreateHttp("https://preprod.iqos.kz/api/users");
                        httpWebRequest.Method = "POST";
                        httpWebRequest.ContentType = "application/json";
                        String encoded = System.Convert.ToBase64String(System.Text.Encoding.GetEncoding("ISO-8859-1").GetBytes(username + ":" + token));
                        httpWebRequest.Headers.Add("Authorization: Basic " + encoded);

                        // User u = new User("mail@mail.ru", "password", "mail@mail.ru", "RU", "FirstName", "lastName", "1979-02-02", "77078248238", "", "Alamty");                    
                        using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
                        {

                            //string json = JsonConvert.SerializeObject(u); //"{\"email\":\"mikhail@smartex2.kz\",\"user_type\":\"C\",\"company_id\":\"1\",\"status\":\"A\",\"password\":\"e10adc3949ba59abbe56e057f20f883e\",\"user_login\":\"77078248238\",\"lang_code\":\"ru\"}";
                            streamWriter.Write(json[0]);
                            streamWriter.Flush();
                            streamWriter.Close();
                        }
                        var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
                        using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
                        {
                            var result = streamReader.ReadToEnd();
                            Dictionary<String, String> res = JsonConvert.DeserializeObject<Dictionary<String, String>>(result);
                            String dcsID = "";
                            res.TryGetValue("user_id", out dcsID);
                            new DBOperations().doBatchUpdate("update st_respondents set RES_DCS_ID = '" + dcsID + "'  where res_code = " + json[1]);
                            //  return res;
                        }
                    }
                    catch (WebException ex)
                    {
                        using (var streamReader = new StreamReader(ex.Response.GetResponseStream()))
                        {
                            var result = streamReader.ReadToEnd();
                            new DBOperations().doBatchUpdate("update st_respondents set RES_DCS_ERROR = '" + result.ToString() + "'  where res_code = " + json[1]);
                            //return JsonConvert.DeserializeObject<object>(result);
                        }
                    }
                }
                else
                {
                    int milliseconds = 10000;
                    Thread.Sleep(milliseconds);
                }
            }
            return "";*/
            return "";
        }
        ////////////////
        public object POST()
        {
            String inputJSON = "";
            using (var streamReader = new StreamReader(HttpContext.Current.Request.InputStream))
            {
                inputJSON = streamReader.ReadToEnd();
            }
            
            DocumentsPack1C customers = JsonConvert.DeserializeObject<DocumentsPack1C>(inputJSON);

           // foreach(Customer1C customer:customers.consumers)
           // {
                
           // }


            // customers.consumers.
            /* new DBOperationscustomers().doQueryJSON(
                                 insertPrepare(
                                 getPostParams("fields"),
                                 getPostParams("values"),
                                 getPostParams("table"),
                                 getPostParams("where"),
                                 getPostParams("token"))
                             ));
                             */

            return customers;
        }
    }
}