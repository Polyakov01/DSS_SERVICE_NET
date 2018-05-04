using Ionic.Zip;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text;
using System.Web;


namespace MvcApplication1.classes
{
    public class DBOperations
    {
        public static string SqlSafeFieldValue(string field)
        {
            return field.Replace("'", "").Replace("--", "");
        }

        public List<String> doQueryString(String _query, String _fieldName1, String _fieldName2, String _fieldName3)
        {            
            List<String> result = new List<String>();
            using (SqlConnection connection = new SqlConnection())
            {
                
                connection.ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["TSAConnectionString"].ConnectionString; 
                connection.Open();
                SqlCommand command = new SqlCommand(_query, connection);
                SqlDataReader rs = command.ExecuteReader();
                while (rs.Read())
                {
                    result.Add(rs[_fieldName1].ToString());
                    result.Add(rs[_fieldName2].ToString());
                    result.Add(rs[_fieldName3].ToString());
                    rs.NextResult();
                }
            }
            return result;
        }

        public FileInfo doQueryCSVFile(string filePath,string _query)
        {
            using (SqlConnection connection = new SqlConnection())
            {
                connection.ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["TSAConnectionString"].ConnectionString;
                connection.Open();
                SqlCommand command = new SqlCommand(_query, connection);
                SqlDataReader rs = command.ExecuteReader();
                FileInfo f = new FileInfo(filePath);
                f.Directory.Create();
                createCsvFile(rs, new StreamWriter(new FileStream(filePath, FileMode.Create),Encoding.UTF8));
                return compressZipFIle(filePath);
            }
        }

        public FileInfo compressZipFIle(String filePath)
        {
            FileInfo fileToCompress = new FileInfo(filePath);
            FileInfo info = new FileInfo(fileToCompress.Directory + "\\" + fileToCompress.Name + ".zip");
            using (FileStream originalFileStream = fileToCompress.OpenRead())
            {
                if ((File.GetAttributes(fileToCompress.FullName) &
                   FileAttributes.Hidden) != FileAttributes.Hidden & fileToCompress.Extension != ".gz")
                {
                    using (FileStream compressedFileStream = File.Create(fileToCompress.FullName + ".zip"))
                    {
                        using (ZipOutputStream compressionStream = new ZipOutputStream(compressedFileStream))
                        {
                            compressionStream.PutNextEntry(fileToCompress.Name);
                            originalFileStream.CopyTo(compressionStream);
                        }
                    }                                        
                    Console.WriteLine("Compressed {0} from {1} to {2} bytes.",
                    fileToCompress.Name, fileToCompress.Length.ToString(), info.Length.ToString());
                }
            }
            fileToCompress.Delete();
            return info;
        }

        public  void createCsvFile(IDataReader reader, StreamWriter writer)
        {
            try
            {
                string Delimiter = "\"";
                string Separator =  ConfigurationManager.AppSettings["CSV_SEPARATOR"];

                // write header row
                for (int columnCounter = 0; columnCounter < reader.FieldCount; columnCounter++)
                {
                    if (columnCounter > 0)
                    {
                        writer.Write(Separator);
                    }
                    writer.Write(Delimiter + reader.GetName(columnCounter) + Delimiter);
                }

                writer.WriteLine(string.Empty);

                // data loop
                while (reader.Read())
                {
                    // column loop
                    for (int columnCounter = 0; columnCounter < reader.FieldCount; columnCounter++)
                    {
                        if (columnCounter > 0)
                        {
                            writer.Write(Separator);
                        }
                        writer.Write(Delimiter + reader.GetValue(columnCounter).ToString().Replace('"', '\'') + Delimiter);
                    }   // end of column loop
                    writer.WriteLine(string.Empty);
                }   // data loop

                writer.Flush();               
            }
            finally
            {
                writer.Close();
            }
        }
        
        public string doQueryString(String _query, String _fieldName1)
        {
            string result = "";
            using (SqlConnection connection = new SqlConnection())
            {                
               connection.ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["TSAConnectionString"].ConnectionString; 
               connection.Open();
                SqlCommand command = new SqlCommand(_query, connection);
                SqlDataReader rs = command.ExecuteReader();
                while (rs.Read())
                {
                    result = rs[_fieldName1].ToString();
                    rs.NextResult();
                }
            }
            return result;
        }
        public int doBatchUpdate(String _query) 
        {
            using (SqlConnection connection = new SqlConnection())
            {
                connection.ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["TSAConnectionString"].ConnectionString; //"Data Source=89.106.232.34,80;Initial Catalog=batdb;Persist Security Info=True;User ID=batdbuser;password=Batpromo12#";
                connection.Open();
                SqlCommand command = new SqlCommand(_query, connection);
                return command.ExecuteNonQuery();
            }
        }

        public int doInsert(String _query)
        {
            using (SqlConnection connection = new SqlConnection())
            {
                connection.ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["TSAConnectionString"].ConnectionString; //"Data Source=89.106.232.34,80;Initial Catalog=batdb;Persist Security Info=True;User ID=batdbuser;password=Batpromo12#";
                connection.Open();
                SqlCommand command = new SqlCommand(_query, connection);
                //SqlDataReader rs =   
                var o = command.ExecuteScalar();
                return int.Parse(o.ToString());
            }
        }

    public List<Dictionary<string, dynamic>> doQueryJSON(String _query)
    {
        var resultList = new List<Dictionary<string, dynamic>>();
        using (SqlConnection connection = new SqlConnection())
        {
            connection.ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings["TSAConnectionString"].ConnectionString;
            connection.Open();
            SqlCommand command = new SqlCommand(_query, connection);
            SqlDataReader rs = command.ExecuteReader();
            while (rs.Read())
            {
                var t = new Dictionary<string, dynamic>();
                for (var i = 0; i < rs.FieldCount; i++)
                {
                    t[rs.GetName(i)] = rs[i];
                }
                resultList.Add(t);
            }
        }
        return resultList;       
    }

    }
}