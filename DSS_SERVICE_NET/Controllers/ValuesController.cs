using MvcApplication1.classes;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web;
using System.Web.Http;
using System.Threading.Tasks;
using System.Collections.Specialized;


namespace MvcApplication1.Controllers
{
    public class ValuesController : ApiController
    {
        // GET api/values
        public HttpResponseMessage Get()
        {

            NameValueCollection col = new NameValueCollection();
            col.Add("file_name", "testFile.jpg");
            col.Add("folder_name", "968");

            String token = LoginTest();
            String res = "TEST_BEGIN" + "<br>"
                + getData(token)+"<br>"
                + insertData(token)+"<br>"
                + ExportTest(token) + "<br>" 
                + ReportCSVTest(token) + "<br>"
                +ReportCSVTest(token,"5") + "<br>"
                + RelocateTest(token) + "<br>"
                + UploadFilesToRemoteUrl("http://" + HttpContext.Current.Request.Url.Host + ":" + HttpContext.Current.Request.Url.Port + "/api/PhotoUpload", new String[] { HttpContext.Current.Request.PhysicalApplicationPath + "/testFiles/TailolHot.mp4" }, col);

           

           
            //PostMultipleFiles("http://" + HttpContext.Current.Request.Url.Host + ":" + HttpContext.Current.Request.Url.Port + "/api/FileUpload", new String[] {HttpContext.Current.Request.PhysicalApplicationPath+"/testFiles/1.jpg" });
            HttpResponseMessage mes = new HttpResponseMessage();
            
            return Request.CreateResponse(HttpStatusCode.OK, res);
            // return mes;
        }

        private string doPostRequest(string postData,String Controller)
        {
            ASCIIEncoding encoding = new ASCIIEncoding();
            //string postData = "login=" + "promo.2017" + "&password=" + "11115555";
            byte[] data = encoding.GetBytes(postData);

            WebRequest request = WebRequest.Create("http://" + HttpContext.Current.Request.Url.Host + ":" + HttpContext.Current.Request.Url.Port + "/api/" + Controller);
            request.Method = "POST";
            request.ContentType = "application/x-www-form-urlencoded";
            request.ContentLength = data.Length;
            
            Stream stream = request.GetRequestStream();
            stream.Write(data, 0, data.Length);
            stream.Close();
            
            WebResponse response = request.GetResponse();
            stream = response.GetResponseStream();

            StreamReader sr99 = new StreamReader(stream);
            String res = sr99.ReadToEnd();
            sr99.Close();
            stream.Close();
            return res;
        }

        private string LoginTest ()
        {
            string postData = "login=" + "SUPERADMIN" + "&password=" + "8230";
            DSS_RESPONSE_TOKEN res = JsonConvert.DeserializeObject<DSS_RESPONSE_TOKEN>(doPostRequest(postData, "Login"));  
            return res.token;
        }

        private string DBTest()
        {
            string postData = "login=" + "SUPERADMIN" + "&password=" + "8230";
            DSS_RESPONSE_TOKEN res = JsonConvert.DeserializeObject<DSS_RESPONSE_TOKEN>(doPostRequest(postData, "Login"));
            return res.token;
        }


        private string getData(string token)
        {
            string postData = "fields=*&table=VIEW_AUTHENTICATION&where=WHERE USE_LOGIN = 'SUPERADMIN' AND USE_PASSWORD = '8230'&token="+token;
            DSS_RESPONSE_TOKEN res = JsonConvert.DeserializeObject<DSS_RESPONSE_TOKEN>(doPostRequest(postData, "GetData"));
            return res.token;
        }

        private string insertData(string token)
        {
            string postData = "table=ST_PRODUCTS&fields=PRO_NAME, PRO_DESC, PRO_PRG_CODE, PRO_BASE_PRICE, PRO_INFO, PRO_KET_CODE, PRO_SHOW_ORDER, PRO_ID, PRO_ACTIVE'&values=N'test', NULL, 1, N'100', NULL, 3, NULL, N'test001', 1&token="+token;
            DSS_RESPONSE_TOKEN res = JsonConvert.DeserializeObject<DSS_RESPONSE_TOKEN>(doPostRequest(postData, "InsertData"));
            return res.token;
        }

        private string RelocateTest(String token)
        {
            //INSERT INTO AT_APP_RELOCATE(AAR_USE_CODE, AAR_HASH, AAR_ROUTE, AAR_DATA, AAR_ACCESS_TOKEN) VALUES(194, N'NiaE7Fwec0', N'/локатор', N'{"salepoint":"28"}', N'6891f9aceb4c4fb74a00afbd83ea77c7d435bf0c')            
            string postData = "hash=" + "NiaE7Fwec0";
            DSS_RESPONSE_QUERY res = JsonConvert.DeserializeObject<DSS_RESPONSE_QUERY>(doPostRequest(postData, "Relocate"));
            return  Convert.ToString(res.data);
        }

        private string ExportTest(String token)
        {
            /*
            String token = getPostParams("token");
                    String table = getPostParams("table");
                    String where = getPostParams("where");
                    String order = getPostParams("order");
                    String reportCode = getPostParams("report_code")*/
            String postData = "token="+token+"&"+"table="+"VIEW_ST_USER"+"&where=where 1=1";
            return doPostRequest(postData,"Export");
        }

        private string ReportCSVTest(String token,String report_code="6")
        {
            String postData = "token=" + token + "&" + "table=" + "VIEW_ST_USER" + "&where=where 1=1&report_code=" + report_code;
            return doPostRequest(postData, "Export");
        }

        public static string UploadFilesToRemoteUrl(string url, string[] files, NameValueCollection formFields = null)
        {
            string boundary = "----------------------------" + DateTime.Now.Ticks.ToString("x");

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.ContentType = "multipart/form-data; boundary=" +
                                    boundary;
            request.Method = "POST";
            request.KeepAlive = true;

            Stream memStream = new System.IO.MemoryStream();

            var boundarybytes = System.Text.Encoding.ASCII.GetBytes("\r\n--" +
                                                                    boundary + "\r\n");
            var endBoundaryBytes = System.Text.Encoding.ASCII.GetBytes("\r\n--" +
                                                                        boundary + "--");


            string formdataTemplate = "\r\n--" + boundary +
                                        "\r\nContent-Disposition: form-data; name=\"{0}\";\r\n\r\n{1}";

            if (formFields != null)
            {
                foreach (string key in formFields.Keys)
                {
                    string formitem = string.Format(formdataTemplate, key, formFields[key]);
                    byte[] formitembytes = System.Text.Encoding.UTF8.GetBytes(formitem);
                    memStream.Write(formitembytes, 0, formitembytes.Length);
                }
            }

            string headerTemplate =
                "Content-Disposition: form-data; name=\"{0}\"; filename=\"{1}\"\r\n" +
                "Content-Type: application/octet-stream\r\n\r\n";

            for (int i = 0; i < files.Length; i++)
            {
                memStream.Write(boundarybytes, 0, boundarybytes.Length);
                var header = string.Format(headerTemplate, "uplTheFile", files[i]);
                var headerbytes = System.Text.Encoding.UTF8.GetBytes(header);

                memStream.Write(headerbytes, 0, headerbytes.Length);

                using (var fileStream = new FileStream(files[i], FileMode.Open, FileAccess.Read))
                {
                    var buffer = new byte[1024];
                    var bytesRead = 0;
                    while ((bytesRead = fileStream.Read(buffer, 0, buffer.Length)) != 0)
                    {
                        memStream.Write(buffer, 0, bytesRead);
                    }
                }
            }

            memStream.Write(endBoundaryBytes, 0, endBoundaryBytes.Length);
            request.ContentLength = memStream.Length;

            using (Stream requestStream = request.GetRequestStream())
            {
                memStream.Position = 0;
                byte[] tempBuffer = new byte[memStream.Length];
                memStream.Read(tempBuffer, 0, tempBuffer.Length);
                memStream.Close();
                requestStream.Write(tempBuffer, 0, tempBuffer.Length);
            }

            using (var response = request.GetResponse())
            {
                Stream stream2 = response.GetResponseStream();
                StreamReader reader2 = new StreamReader(stream2);
                return reader2.ReadToEnd();
            }
        }

        public void PostMultipleFiles(string url, string[] files)
        {
            
            /*string boundary = "----------------------------" + DateTime.Now.Ticks.ToString("x");
            HttpWebRequest httpWebRequest = (HttpWebRequest)WebRequest.Create(url);
            httpWebRequest.ContentType = "multipart/form-data; boundary=" + boundary;
            httpWebRequest.Method = "POST";
            httpWebRequest.KeepAlive = true;
            httpWebRequest.Credentials = System.Net.CredentialCache.DefaultCredentials;
            Stream memStream = new System.IO.MemoryStream();
            byte[] boundarybytes = System.Text.Encoding.ASCII.GetBytes("\r\n--" + boundary + "\r\n");
            string formdataTemplate = "\r\n--" + boundary + "\r\nContent-Disposition:  form-data; name=\"{0}\";\r\n\r\n{1}";
            string headerTemplate = "Content-Disposition: form-data; name=\"{0}\"; filename=\"{1}\"\r\n Content-Type: application/octet-stream\r\n\r\n";
            memStream.Write(boundarybytes, 0, boundarybytes.Length);
            for (int i = 0; i < files.Length; i++)
            {
                string header = string.Format(headerTemplate, "file" + i, files[i]);
                //string header = string.Format(headerTemplate, "uplTheFile", files[i]);
                byte[] headerbytes = System.Text.Encoding.UTF8.GetBytes(header);
                memStream.Write(headerbytes, 0, headerbytes.Length);
                FileStream fileStream = new FileStream(files[i], FileMode.Open,
                FileAccess.Read);
                byte[] buffer = new byte[1024];
                int bytesRead = 0;
                while ((bytesRead = fileStream.Read(buffer, 0, buffer.Length)) != 0)
                {
                    memStream.Write(buffer, 0, bytesRead);
                }
                memStream.Write(boundarybytes, 0, boundarybytes.Length);
                fileStream.Close();
            }

            ASCIIEncoding encoding = new ASCIIEncoding();
            byte[] data = encoding.GetBytes("fileName=tmpJPG.jpg,foldername=961");

            httpWebRequest.ContentLength = memStream.Length + data.Length;
            Stream requestStream = httpWebRequest.GetRequestStream();
            memStream.Position = 0;
            byte[] tempBuffer = new byte[memStream.Length];
            memStream.Read(tempBuffer, 0, tempBuffer.Length);
            memStream.Close();
            requestStream.Write(tempBuffer, 0, tempBuffer.Length);
            //requestStream.Close();
                       
            //Stream str = httpWebRequest.GetRequestStream();
            requestStream.Write(data, 0, data.Length);
            requestStream.Close();
            
            try
            {
                WebResponse webResponse = httpWebRequest.GetResponse();
                Stream stream = webResponse.GetResponseStream();
                StreamReader reader = new StreamReader(stream);
                string var = reader.ReadToEnd();

            }
            catch (Exception ex)
            {
                //Request.CreateResponse().Cont = ex.Message;
            }
            httpWebRequest = null;*/

           

        }

        // GET api/values/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        public void Post([FromBody]string value)
        {
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