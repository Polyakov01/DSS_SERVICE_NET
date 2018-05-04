using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MvcApplication1.classes
{
    public class User
    {
        public String email { get; set; }           
        public String password { get; set; }
        public String user_login { get; set; }
        public String lang_code { get; set; }        
        public string firstname { get; set; }
        public string lastname { get; set; }
        public string birthday { get; set; }
        public string phone { get; set; }
        public string reference_id { get; set; }
        public string b_city { get; set; }
        public string comments { get; set; }
        public string age_verified = "Y";
        public string to_customer = "Y";
        public String user_type = "K";
        public string company_id = "1";
        public string status = "A";

        public User(string email, string password, string user_login, string lang_code, string firstname, string lastname, string birthday, string phone, string reference_id, string b_city)
        {
            this.email = email;
            this.password = password;
            this.user_login = user_login;
            this.lang_code = lang_code;
            this.firstname = firstname;
            this.lastname = lastname;
            this.birthday = birthday;
            this.phone = phone;
            this.reference_id = reference_id;
            this.b_city = b_city;
        }
    }
}