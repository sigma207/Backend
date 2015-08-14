package com.jelly.jt8.bo.util;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by user on 2015/8/13.
 */
public class JsParse {
    private static SimpleDateFormat jsDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
    private static SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");
    public static String jsDateToDate(String dateString) throws Exception{
        Date date = jsDateFormat.parse(dateString);
        return dateFormat.format(date);
    }
    public static String dateToJsDate(String dateString) throws Exception{
        Date date = dateFormat.parse(dateString);
        return "\\/Date(" + date.getTime() + "-0400)\\/";
//        return jsDateFormat.format(date);
    }

    public static String dateToString(Date date) throws Exception{
        return dateFormat.format(date);
    }

    public static Date stringToDate(String dateString) throws Exception{
        return dateFormat.parse(dateString);
    }
}
