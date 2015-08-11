package com.jelly.jt8.bo.util;

import org.apache.commons.beanutils.BeanUtils;

import java.lang.reflect.Field;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.util.List;

/**
 * Created by user on 2015/8/11.
 */
public class RsMapper {
    @SuppressWarnings("unchecked")
    public static void map(ResultSet rs, List list, Class outputClass) {
        try {
            if (rs != null) {
                ResultSetMetaData rsmd = rs.getMetaData();
                Field[] fields = outputClass.getDeclaredFields();
                while (rs.next()) {
                    Object bean = outputClass.newInstance();
                    for (int _iterator = 0; _iterator < rsmd.getColumnCount(); _iterator++) {
                        String columnName = rsmd.getColumnName(_iterator + 1);
                        Object columnValue = rs.getObject(_iterator + 1);
                        for (Field field : fields) {
                            if (field.getName().equalsIgnoreCase(columnName) && columnValue != null) {
                                BeanUtils.setProperty(bean, field.getName(), columnValue);
                                break;
                            }
                        }
                    }
                    list.add(bean);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
