using MvcApplication1.classes;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data.SqlClient;
using System.Diagnostics;
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
    public class PhotoUploadController : DSSApiController
    {
        /*
        public async Task<HttpResponseMessage> PostFormData()
        {
            // Check if the request contains multipart/form-data.
            if (!Request.Content.IsMimeMultipartContent("form-data"))
            {
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            }

            string root = HttpContext.Current.Server.MapPath("~/App_Data");
            var provider = new MultipartFormDataStreamProvider(root);

            try
            {
                // Read the form data.
                await Request.Content.ReadAsMultipartAsync(provider);

                // This illustrates how to get the file names.
                foreach (MultipartFileData file in provider.FileData)
                {
                   
                    Trace.WriteLine(file.Headers.ContentDisposition.FileName);
                    Trace.WriteLine("Server file path: " + file.LocalFileName);
                }
                return Request.CreateResponse(HttpStatusCode.OK);
            }
            catch (System.Exception e)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, e);
            }
        }
        */
        public DSS_RESPONSE Post()
        {            
            try
            {
                String fileName =  getPostParams("file_name");
                String folderName = getPostParams("folder_name");
                string outPutFileName = SystemPath.getPhotoFilePath(fileName, folderName);                
                
                HttpContext.Current.Request.Files[0].SaveAs(outPutFileName);
                
                if (outPutFileName.EndsWith(".jpg") || outPutFileName.EndsWith(".png"))
                {
                    System.Drawing.Image image = System.Drawing.Image.FromFile(outPutFileName);
                    float thumbcoef = image.Width / (float)image.Height;

                  
                    System.Drawing.Image thumb = image.GetThumbnailImage(200, (int)Math.Round(200 / thumbcoef,0), () => false, IntPtr.Zero);
                    thumb.Save(outPutFileName.Substring(0,outPutFileName.LastIndexOf('.'))+"_thumb.jpg");
                    image.Dispose();
                    thumb.Dispose();
                    GC.Collect();
                }
                return new DSS_RESPONSE_FILE(fileName);         
            }
            catch (Exception ex)
            {
                return new DSS_RESPONSE_ERROR(ex.Message);
            }
        }
 
         
    }
}