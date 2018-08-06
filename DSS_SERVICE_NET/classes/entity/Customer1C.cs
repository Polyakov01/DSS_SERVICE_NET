using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MvcApplication1.classes.entity
{
    public class Customer1C
    {
        public String Код = "";
        public String ИИН = "";
        public String Наименование = "";
        public String НаименованиеПолное = "";
        public String ДатаРегистрации = "";
        public String ГруппаДоступа = "";
        public String Пол = "";
        public String ДатаРождения = "";
        public String Адрес = "";
        public String Телефон = "";
        public String Email = "";
        public List<Document1C> ДокументыПродажи = new List<Document1C>();
    }
}