package com.jelly.jt8.common;

import java.text.SimpleDateFormat;
import java.util.Calendar;

/**
 * Created by user on 2015/7/29.
 */
public class Utils {
    public static SimpleDateFormat updateTimeFormat = new SimpleDateFormat("yyyyMMddHHmmss");
    public static String updateTime(){
        return  updateTimeFormat.format(Calendar.getInstance().getTime());
    }
}
