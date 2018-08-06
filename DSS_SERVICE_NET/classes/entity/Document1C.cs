using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MvcApplication1.classes.entity
{
    public class Document1C
    {
        public String ТипДокумента { get; set; }
        public String Номер { get; set; }
        public String Дата { get; set; }
        public String Склад { get; set; }
        public String Валюта { get; set; }
        public List<Products1C> Товары = new List<Products1C>();

    }
}
