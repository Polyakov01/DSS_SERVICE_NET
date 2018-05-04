using MvcApplication1.classes;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.ComponentModel;
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
    public class FileUploadController : DSSApiController
    {
        public DSS_RESPONSE Post()
        {            
            try
            {
                String fileName =  getPostParams("file_name");
                String folderName = getPostParams("folder_name");
                string outPutFileName = SystemPath.getUploadFilePath(fileName, folderName);                
                
                HttpContext.Current.Request.Files[0].SaveAs(outPutFileName);
                
                if (outPutFileName.EndsWith(".jpg") || outPutFileName.EndsWith(".png"))
                {
                    System.Drawing.Image image = System.Drawing.Image.FromFile(outPutFileName);                    
                    System.Drawing.Image thumb = image.GetThumbnailImage(200, 200, () => false, IntPtr.Zero);
                    thumb.Save(outPutFileName.Substring(0,outPutFileName.LastIndexOf('.'))+"_thumb.jpg",System.Drawing.Imaging.ImageFormat.Jpeg);
                    image.Dispose();
                    thumb.Dispose();

                    GC.Collect();
                }
                
                //fileName.IndexOf("/upload")
                return new DSS_RESPONSE_FILE(fileName);  
               // return new DSS_RESPONSE(true);         
            }
            catch (Exception ex)
            {
                return new DSS_RESPONSE_ERROR(ex.Message);
            }              
        }
    }
}