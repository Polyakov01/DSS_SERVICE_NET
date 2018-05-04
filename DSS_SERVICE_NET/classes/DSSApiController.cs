using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace MvcApplication1.classes
{
    public class DSSApiController : ApiController
    {
        protected string getPostParams(string paramName, bool sqlSafe = false)
        {
            return sqlSafe? HttpContext.Current.Request.Params[paramName].Replace("'","").Replace("-- ","") :  HttpContext.Current.Request.Params[paramName];
        }

        protected string getPostJSON()
        {
            return new System.IO.StreamReader(HttpContext.Current.Request.InputStream).ReadToEnd();
        }

        protected int getPostParamsInt(string paramName)
        {
            try
            {
                return  int.Parse(HttpContext.Current.Request.Params[paramName]);
            }
            catch
            {
                return 0;
            }
            
        }

        protected String queryPrepare(String fields, String table, String where, String token, String order, String start, String end)
        {
            if (fields != string.Empty && table != string.Empty && where != string.Empty && token != string.Empty)
            {
                String queryString = "";
                if (TokenManager.checkToken(token))
                {
                    String orderExpression = "";
                    Boolean isOrder = false;
                    if (order != string.Empty && order !=null)
                    {
                        isOrder = true;
                        orderExpression = " ORDER BY " + order;
                    }

                    if (start != string.Empty && start != null)
                    {
                        queryString += "SELECT * FROM  (SELECT " + fields + ", ROW_NUMBER() OVER (ORDER BY (SELECT 1)" + (isOrder ? "," + order : "") + ") as row FROM " + table + " " + where + " ) a WHERE row >= " + start + " and row <= " + end;
                    }
                    else
                    {
                        queryString += "SELECT " + fields + " FROM " + table + " " + where + orderExpression;
                    }                    
                    return queryString;
                }
                else
                {
                    throw new Exception("token expired");
                }
            }
            else
            {
                throw new Exception("Empty fields");
            }
        }

        protected String updatePrepare(String fields, String table, String where, String token)
        {
            if (fields != string.Empty && table != string.Empty && where != string.Empty && token != string.Empty)
            {
                if (TokenManager.checkToken(token))
                {
                    return "UPDATE " + table + " SET " + fields + " WHERE " + where;
                }
                else
                {
                    throw new Exception("token expired");
                }
            }
            else
            {
                throw new Exception("Empty fields");
            }
        }

        protected String insertPrepare(String fields, String values,String table, String where, String token)
        {
            if (fields != string.Empty && table != string.Empty && values != string.Empty&& where != string.Empty && token != string.Empty)
            {
                if (TokenManager.checkToken(token))
                {
                    //return "INSERT INTO " + table + " (" + fields + ") VALUES (" + values + ");" + "SELECT cast (IDENT_CURRENT('" + table + "') as integer) AS 'key'";
                    return "INSERT INTO " + table + " (" + fields + ") VALUES (" + values + ");" + "SELECT cast (SCOPE_IDENTITY() as integer) AS 'key'";
                }
                else
                {
                    throw new Exception("token expired");
                }
            }
            else
            {
                throw new Exception("Empty fields");
            }
        }


    }
}