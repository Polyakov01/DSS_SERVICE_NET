using MvcApplication1.classes;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data.SqlClient;
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
    public class RegistrationController : DSSApiController
    {
        public DSS_REG_RESPONSE Post()
        {
            String param = getPostJSON();

            DSS_REG_REQUEST req = JsonConvert.DeserializeObject<DSS_REG_REQUEST>(param);
            
            
            
            var resultList = new List<Dictionary<string, dynamic>>();
            var addInfo = new List<Dictionary<string, dynamic>>();
            var items = new Dictionary<string, dynamic>();            
            var orderParams = new Dictionary<string, dynamic>();

            String iin = req.items[0]["service_params"]["IIN"];
            String phone = req.items[0]["service_params"]["Phone"];
            String email = req.items[0]["service_params"]["email"];

            String passwd = new DBOperations().doQueryString("EXEC ADD_USER '"+ phone+"' , '"+ iin +"'", "RESULT");

           // new DBOperations().doQueryJSON(getPostParams("query"))


            items.Add("order_ID", req.items[0]["order_ID"]);            
            items.Add("service_ID", req.items[0].service_ID);
            items.Add("provider_ID", req.items[0]["provider_ID"]);
            
            items.Add("state_code", "1");
            items.Add("state_desc_ru", "ДЕМО");
            items.Add("state_desc_kz", "ДЕМО");
            items.Add("state_time", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss +0300"));

            orderParams.Add("login", phone /*"ismetocp@gmail.com"*/);
            orderParams.Add("password", passwd);
            orderParams.Add("text", "Добро пожаловать! Приложение можно скачать по ссылке: https://dss.tsaplatform.ru/");
            addInfo.Add(orderParams);
            items.Add("add_info", addInfo);          
   
            resultList.Add(items);
            return new DSS_REG_RESPONSE(req.cart_ID,req.request_ID,req.consumer_ID, resultList);                                       
        }
        
    }
}