using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using NPOI.OpenXml4Net;
using System.Text;
using NPOI.OpenXml4Net.OPC;
using NPOI.XWPF.UserModel;
using System.IO.Compression;
using Ionic.Zip;
using System.Xml;
using System.Configuration;

namespace MvcApplication1.classes
{
    public class ExcelWorkbook
    {
        private XSSFWorkbook workbook = null;
        private FileStream workbookfs = null;
        private FileInfo currentFile = null;
        public ExcelWorkbook(FileInfo filePath)                   
        {
            currentFile = filePath;
            if (!filePath.Exists)
            {                
                XSSFWorkbook wb = new XSSFWorkbook();
                FileStream tmpfs = new FileStream(filePath.FullName, FileMode.CreateNew);
                if (wb.GetSheetIndex("data") == -1)
                {
                  XSSFSheet sheet = new XSSFSheet();
                  wb.CreateSheet("data");
                  wb.GetSheet("data").CreateRow(0);
                  wb.GetSheet("data").GetRow(0).GetCell(1, MissingCellPolicy.CREATE_NULL_AS_BLANK).SetCellValue("data");                        
                }               
                wb.Write(tmpfs);
                tmpfs.Close();
                wb.Close();
                changeWorkbookTypeZipMemory(filePath);
            }
            changeWorkbookConnectionZip(filePath);
            try 
            {
                workbookfs = new FileStream(filePath.FullName, FileMode.Open);
                workbook = new XSSFWorkbook(workbookfs);
            }
            catch (Exception e)
            {
                workbook = null;
                System.GC.Collect();
                throw e;
            }           
        }

        private void changeWorkbookTypeZip(FileInfo filePath)
        {
            Random rnd = new Random();
            long tmpF = rnd.Next(1, 25) * 10
                       + rnd.Next(1, 25) * rnd.Next(1, 2) * 100
                       + rnd.Next(45, 85) * rnd.Next(0, 1) * 1000
                       + rnd.Next(1, 124) * 10000
                       + rnd.Next(1, 435) * 100000
                       + rnd.Next(1, 435) * 100000
                       + rnd.Next(1, 435) * 100000
                       + rnd.Next(1, 435) * 100000
                       + DateTime.Now.ToFileTimeUtc()
                       + DateTime.Now.Millisecond
                       + DateTime.Now.ToFileTimeUtc() * rnd.Next(1, 4);
            String tmpDirectoryName = filePath.DirectoryName + "/tmpExtractfile/" + tmpF.ToString() + "/";
            new FileInfo(tmpDirectoryName).Directory.Create();
            ZipFile zip = new ZipFile(filePath.FullName);
            zip["[Content_Types].xml"].Extract(tmpDirectoryName, ExtractExistingFileAction.Throw);
            zip.RemoveEntry("[Content_Types].xml");
            string text = File.ReadAllText(tmpDirectoryName + "[Content_Types].xml");
            text = text.Replace("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml", "application/vnd.ms-excel.sheet.macroEnabled.main+xml");
            File.WriteAllText(tmpDirectoryName + "[Content_Types].xml", text);
            zip.AddFile(tmpDirectoryName + "[Content_Types].xml", "");
            zip.Save();
            zip.Dispose();
            File.Delete(tmpDirectoryName + "[Content_Types].xml");
            Directory.Delete(tmpDirectoryName, false);
        }

        private void changeWorkbookTypeZipMemory(FileInfo filePath)
        {           
            using (ZipFile zip = new ZipFile(filePath.FullName))
            {
                using (MemoryStream ms = new MemoryStream())
                {
                    zip["[Content_Types].xml"].Extract(ms);
                    ms.Position = 0;
                    using (StreamReader sr = new StreamReader(ms, Encoding.ASCII))
                    {
                        string text = sr.ReadToEnd();
                        text = text.Replace("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml", "application/vnd.ms-excel.sheet.macroEnabled.main+xml");
                        zip.RemoveEntry("[Content_Types].xml");
                        zip.AddEntry("[Content_Types].xml", text,Encoding.ASCII);
                        zip.Save();
                        zip.Dispose();                                                                     
                    }
                }
            }
        }

        private void changeWorkbookConnectionZip(FileInfo filePath)
        {
           bool changeNeed = false;
           using (ZipFile zip = new ZipFile(filePath.FullName))
           {
                if (zip["/xl/connections.xml"] != null)
                {
                    ///xl/pivotCache/pivotCacheDefinition1.xml
                    using (MemoryStream ms = new MemoryStream())
                    {
                        zip["/xl/connections.xml"].Extract(ms);
                        ms.Position = 0;
                        XmlDocument doc = new XmlDocument();
                        doc.Load(ms);
                        foreach (XmlNode xnode in doc.DocumentElement)
                        {
                            foreach (XmlNode childnode in xnode.ChildNodes)
                            {
                                if (childnode.Name == "dbPr")
                                {
                                    if (childnode.Attributes.GetNamedItem("connection").Value != ConfigurationManager.AppSettings["REPORTS_CONNECTION_STRING"])
                                    {
                                        childnode.Attributes.GetNamedItem("connection").Value = ConfigurationManager.AppSettings["REPORTS_CONNECTION_STRING"];
                                        changeNeed = true;
                                    }
                                }
                            }
                        }
                        if (changeNeed)
                        {
                            using (MemoryStream msOut = new MemoryStream())
                            {
                                doc.Save(XmlWriter.Create(msOut));
                                msOut.Position = 0;
                                zip.RemoveEntry("/xl/connections.xml");
                                zip.AddEntry("/xl/connections.xml", msOut);
                                zip.Save();
                                msOut.Close();
                                msOut.Dispose();
                            }
                        }
                        ms.Close();
                        ms.Dispose();
                    }                   
                }
                try
                {
                    zip.Save();
                    zip.Dispose();
                }
                catch (Exception ex)
                {
                    System.GC.Collect();
                    //razobratsya pochemy voznikaet exception 
                }
                finally
                {                    
                    System.GC.Collect();
                }
            }
        }

        /* STARAYA VERSIA S FAILAMI 
         *  private void changeWorkbookConnectionZip(FileInfo filePath)
        {
           bool changeNeed = false;
           // Random rnd = new Random();
           // long tmpF = rnd.Next(1, 25) * 10
           //            + rnd.Next(1, 25) * rnd.Next(1, 2) * 100
           //            + rnd.Next(45, 85) * rnd.Next(0, 1) * 1000
           //            + rnd.Next(1, 124) * 10000
           //            + rnd.Next(1, 435) * 100000
           //            + rnd.Next(1, 435) * 100000
           //            + rnd.Next(1, 435) * 100000
           //            + rnd.Next(1, 435) * 100000
           //            + DateTime.Now.ToFileTimeUtc()
           ////            + DateTime.Now.Millisecond
             //          + DateTime.Now.ToFileTimeUtc() * rnd.Next(1, 4);
            //String tmpDirectoryName = filePath.DirectoryName + "/tmpExtractfileConnection/" + tmpF.ToString() + "/";
           // new FileInfo(tmpDirectoryName).Directory.Create();
            using (ZipFile zip = new ZipFile(filePath.FullName))
            {
                if (zip["/xl/connections.xml"] != null)
                {
                    MemoryStream ms = new MemoryStream();
                    //zip["/xl/connections.xml"].Extract(tmpDirectoryName, ExtractExistingFileAction.Throw);
                    zip["/xl/connections.xml"].Extract(ms);
                    ms.Position = 0;
                    XmlDocument doc = new XmlDocument();
                    //doc.Load(tmpDirectoryName + "/xl/connections.xml");
                    //XmlReader xr = XmlReader.Create(ms);
                    doc.Load(ms);
                    XmlElement xRoot = doc.DocumentElement;
                    foreach (XmlNode xnode in xRoot)
                    {                        
                        foreach (XmlNode childnode in xnode.ChildNodes)
                        {
                            if (childnode.Name == "dbPr")
                            {
                                if (childnode.Attributes.GetNamedItem("connection").Value != ConfigurationManager.AppSettings["REPORTS_CONNECTION_STRING"])
                                {
                                    childnode.Attributes.GetNamedItem("connection").Value = ConfigurationManager.AppSettings["REPORTS_CONNECTION_STRING"];
                                    changeNeed = true;
                                }
                            }
                        }
                    }
                    MemoryStream msOut = new MemoryStream();
                    XmlWriter wr = XmlWriter.Create(msOut);
                    doc.Save(wr);
                    // doc.Save(tmpDirectoryName + "/xl/connections.xml");
                    if (changeNeed)
                    {
                        msOut.Position = 0;
                        zip.RemoveEntry("/xl/connections.xml");
                        zip.AddEntry("/xl/connections.xml", msOut);
                        // zip.AddFile(tmpDirectoryName + "/xl/connections.xml", "/xl/");
                    }
                    zip.Save();
                    zip.Dispose();
                    ms.Close();
                    ms.Dispose();
                    msOut.Close();
                    msOut.Dispose();
                    //File.Delete(tmpDirectoryName + "/xl/connections.xml");
                    //Directory.Delete(tmpDirectoryName+"/xl/", false);
                    //Directory.Delete(tmpDirectoryName, false);
                    System.GC.Collect();
                }
            }
        }

        /**/

        public void setHash(String hash)
        {
            workbook.GetProperties().ExtendedProperties.GetUnderlyingProperties().Company = hash;
        }

        public void writeFile(string fileName)
        {
            try
            {
                using (FileStream fs = new FileStream(fileName, FileMode.CreateNew))
                {
                    workbook.Write(fs);
                    fs.Close();
                }

                using (ZipFile zip = new ZipFile(currentFile.FullName))
                {
                    if (zip["xl/pivotCache/pivotCacheDefinition1.xml"] != null)
                    {
                        using (MemoryStream ms = new MemoryStream())
                        {
                            zip["xl/pivotCache/pivotCacheDefinition1.xml"].Extract(ms);
                            ms.Position = 0;
                            using (ZipFile Outzip = new ZipFile(fileName))
                            {
                                Outzip.RemoveEntry("xl/pivotCache/pivotCacheDefinition1.xml");
                                Outzip.AddEntry("xl/pivotCache/pivotCacheDefinition1.xml", ms);
                                Outzip.Save();
                                Outzip.Dispose();
                            } 
                            ms.Close();
                            ms.Dispose();
                        }
                    }
                    if (zip["/xl/pivotTables/pivotTable1.xml"] != null)
                    {
                        using (MemoryStream ms = new MemoryStream())
                        {
                            zip["/xl/pivotTables/pivotTable1.xml"].Extract(ms);
                            ms.Position = 0;
                            using (ZipFile Outzip = new ZipFile(fileName))
                            {
                                Outzip.RemoveEntry("/xl/pivotTables/pivotTable1.xml");
                                Outzip.AddEntry("/xl/pivotTables/pivotTable1.xml", ms);
                                Outzip.Save();
                                Outzip.Dispose();
                            }
                            ms.Close();
                            ms.Dispose();
                        }
                    }
                    try
                    {
                        zip.Save();
                        zip.Dispose();
                    }
                    catch (Exception ex)
                    {
                        System.GC.Collect();
                        //razobratsya pochemy voznikaet exception 
                    }
                    finally
                    {
                        System.GC.Collect();
                    }
                }
                workbook.Close();
            }
            finally
            {
                workbook.Close();
                System.GC.Collect();
            }            
        }
        
        public void closeWorkbook()
        {
            if (workbook !=null)
            workbook.Close();
        }
    }
}