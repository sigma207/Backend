package com.jelly.jt8.test;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.jelly.jt8.common.Parameters;
import com.jelly.jt8.view.JSonBody;

/**
 * Created by user on 2015/7/23.
 */
public class Test {
    public static void main(String[] args){
        String result;
        Gson gson = new Gson();
        JsonObject myObj = new JsonObject();
        StringBuffer buf = new StringBuffer();
        buf.append("ABC" + Parameters.DATA_DELIMITER + "DEF");
        buf.append(Parameters.RECORD_DELIMITER);
        buf.append("GCC" + Parameters.DATA_DELIMITER + "123");
        buf.append(Parameters.RECORD_DELIMITER);
        if (buf.length() > 0) {
            buf.delete(buf.length() - 1, buf.length());
        }
        JSonBody jsonBody1 = new JSonBody(buf.toString(), "");
        myObj.addProperty("column1", gson.toJson(jsonBody1));
//        myObj.add("column2",jsonBody1);
        result = gson.toJson(myObj);
        result = myObj.toString();
//        result = gson.toJson(jsonBody1);
        System.out.println(result);
    }
}
