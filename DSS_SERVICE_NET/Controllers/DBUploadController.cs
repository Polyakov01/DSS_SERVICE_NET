using MvcApplication1.classes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Data.SQLite;

namespace MvcApplication1.Controllers
{
    public class DBUploadController : DSSApiController
    {

        public DSS_RESPONSE Get()
        {
            var resultList = new List<Dictionary<string, dynamic>>();
            using (SQLiteConnection connection = new SQLiteConnection())
            {
                connection.ConnectionString = "Data Source=D:\\tsa.db;Version=3;New=false;";
                connection.Open();
                SQLiteCommand command = new SQLiteCommand("select * from st_menu", connection);
                SQLiteDataReader rs = command.ExecuteReader(/*System.Data.CommandBehavior.SequentialAccess*/);
                while (rs.Read())
                {
                    var t = new Dictionary<string, dynamic>();
                    for (var i = 0; i < rs.FieldCount; i++)
                    {
                        t[rs.GetName(i)] = rs[i];
                    }
                    resultList.Add(t);
                }
                connection.Close();
            }

            return new DSS_RESPONSE_QUERY(resultList);
        }
        
        public DSS_RESPONSE Post()
        {

            return new DSS_RESPONSE(true);
            /*try
            {
                if (TokenManager.checkToken(getPostParams("token")))
                {
                    return new DSS_RESPONSE_QUERY(new DBOperations().doQueryJSON(getPostParams("query")));
                }
                else
                {
                    throw new Exception("token expired");
                }
            }
            catch (Exception ex)
            {
                return new DSS_RESPONSE_ERROR(ex.Message);
            }*/
        }
    }
}
