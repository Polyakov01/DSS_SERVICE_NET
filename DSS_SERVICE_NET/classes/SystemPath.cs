using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;

namespace MvcApplication1.classes
{
    public class SystemPath
    {
        public static string getReportCompleteFolder(String fileName, String useCode = "")
        {
            return ConfigurationManager.AppSettings["REPORTS_COMPLETE_FOLDER"]=="default"?
                                HttpContext.Current.Request.PhysicalApplicationPath
                                +"reports/users/"
                                +useCode
                                +"/"
                                + fileName :
                            ConfigurationManager.AppSettings["REPORTS_COMPLETE_FOLDER"] + fileName;
            
        }
        public static string getReportCompleteUrl(String fileName, String useCode = "")
        {
            return ConfigurationManager.AppSettings["REPORTS_URL"] == "default" ?
                        HttpContext.Current.Request.Url.Scheme + "://"
                        + HttpContext.Current.Request.Url.Host
                        + ":"
                        + HttpContext.Current.Request.Url.Port
                        + "/reports/users/"
                        + useCode
                        + "/"
                        + fileName :
                    ConfigurationManager.AppSettings["REPORTS_URL"] + fileName;

        }
        public static string getReportTemplateUrl(String fileName)
        {
            return ConfigurationManager.AppSettings["REPORTS_TEMPLATE_URL"] == "default" ?
                        HttpContext.Current.Request.Url.Scheme + "://"
                        + HttpContext.Current.Request.Url.Host
                        + ":"
                        + HttpContext.Current.Request.Url.Port
                        + "/reports/templates/"
                        + fileName :
                    ConfigurationManager.AppSettings["REPORTS_TEMPLATE_URL"] + fileName;

        }
        public static string getReportTemplateFolder(String fileName)
        {
            return  ConfigurationManager.AppSettings["REPORTS_COMPLETE_FOLDER"] == "default" ?
                                HttpContext.Current.Request.PhysicalApplicationPath
                                + "reports/templates/"                               
                                + fileName :
                            ConfigurationManager.AppSettings["REPORTS_COMPLETE_FOLDER"] + fileName;

        }

        public static string getFolderNameDate()
        {
            return DateTime.Now.ToString("dd.MM.yyyy") + "/";
        }

        public static string getUploadFilePath(string fileName, string folderName = "")
        {
            //FileInfo fi = new FileInfo(HttpContext.Current.Request.PhysicalApplicationPath + "/upload/" + getFolderNameDate() + folderName + "/" + fileName);
            FileInfo fi = new FileInfo(HttpContext.Current.Request.PhysicalApplicationPath + "/upload/" + folderName + "/" + fileName);
            fi.Directory.Create();
            return fi.FullName;
        }

        public static string getPhotoFilePath(string fileName,string folderName = "")
        {
           // folderDate = getFolderNameDate();           
            FileInfo fi = new FileInfo(
                                        Path.Combine(new string[]
                                            {HttpContext.Current.Request.PhysicalApplicationPath, 
                                                "photo", 
                                                folderName, 
                                                fileName
                                            })
                                        );
            //FileInfo fi = new FileInfo(HttpContext.Current.Request.PhysicalApplicationPath + "/photo/" + folderName + "/" + fileName);
            fi.Directory.Create();
            return fi.FullName;
        }
        public static string getPhotoUrl(String fileName)
        {
            
            return ConfigurationManager.AppSettings["PHOTO_URL"] == "default" ?
                        HttpContext.Current.Request.Url.Scheme+"://"
                        + HttpContext.Current.Request.Url.Host
                        + ":"
                        + HttpContext.Current.Request.Url.Port
                        + "/photo/"
                        + fileName :
                    ConfigurationManager.AppSettings["PHOTO_URL"] + fileName;

        }

        public static string getSMSUrl(String phone, String smsText )
        {
            return ConfigurationManager.AppSettings["SMS_CONNECT_URL"]
                + "login="
                + ConfigurationManager.AppSettings["SMS_CONNECT_LOGIN"]
                + "&psw="
                + ConfigurationManager.AppSettings["SMS_CONNECT_PASSWORD"]
                + "&tinyurl=1"
                + "&phones=" 
                + phone 
                + "&mes="
                + HttpUtility.UrlEncode(smsText,System.Text.Encoding.UTF8);
        }

    }
}