package com.jelly.jt8.bo.util;

/**
 * Created by user on 2015/8/13.
 */
public class SqlTool {
    private static String SP_COLUMN_DELIMITER = ",";
    private static String SP_BATCH_DELIMITER = "|";
    public static void appendStart(StringBuffer sb) throws Exception{
        sb.append("'");
    }

    public static void append(StringBuffer sb,String... values) throws Exception{
        int size = values.length;
        int index = 0;
        for(String value : values){
            value = (value==null)?"":value;
            if(index==size-1){
                sb.append(value);
            }else{
                sb.append(value+SP_COLUMN_DELIMITER);
            }
            index++;
        }

        sb.append(SP_BATCH_DELIMITER);
    }

    public static void appendEnd(StringBuffer sb) throws Exception{
        if (sb.length() > 0) {
            sb.delete(sb.length() - 1, sb.length());
            sb.append("'");
        }
    }
}
