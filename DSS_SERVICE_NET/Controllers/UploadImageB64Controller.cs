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
    public class UploadImageB64Controller : DSSApiController
    {
        public DSS_RESPONSE Post()
        {            
            try
            {
                String fileName =  getPostParams("fileName")+".jpg";
                String folderName = getPostParams("folder");
                String imageBase64 = getPostParams("image").Replace("data:image/png;base64,","");                
                string outPutFileName = SystemPath.getPhotoFilePath(fileName, folderName);
                SaveImage(imageBase64, outPutFileName);
                return new DSS_RESPONSE_FILE(fileName);         
            }
            catch (Exception ex)
            {
                return new DSS_RESPONSE_ERROR(ex.Message);
            }
        }

        public bool SaveImage(string ImgStr, string imgPath)
        {
            if (!System.IO.Directory.Exists(Path.GetDirectoryName(imgPath)))
            {
                System.IO.Directory.CreateDirectory(Path.GetDirectoryName(imgPath));
            }
            byte[] imageBytes = Convert.FromBase64String(ImgStr);
            File.WriteAllBytes(imgPath, imageBytes);
            return true;
        }
 
         
    }
}