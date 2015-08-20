package com.jelly.jt8.bo.util;

import com.jelly.jt8.bo.dao.impl.BaseDao;
import com.jelly.jt8.bo.model.BaseModel;
import org.apache.commons.beanutils.BeanUtils;

import javax.persistence.Id;
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
                Object bean = outputClass.newInstance();
                boolean copyId = (bean instanceof BaseModel);
                while (rs.next()) {
                    bean = outputClass.newInstance();

                    for (int _iterator = 0; _iterator < rsmd.getColumnCount(); _iterator++) {
                        String columnName = rsmd.getColumnName(_iterator + 1);
                        Object columnValue = rs.getObject(_iterator + 1);
                        for (Field field : fields) {
                            if (field.getName().equalsIgnoreCase(columnName) && columnValue != null) {
                                BeanUtils.setProperty(bean, field.getName(), columnValue);
                                if(copyId){
                                    Id id = field.getAnnotation(javax.persistence.Id.class);
                                    if(id!=null){
                                        BeanUtils.setProperty(bean, "id", columnValue);
                                    }
                                }
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
