package com.jelly.test;

import com.jelly.pojo.Person;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * Created by user on 2015/6/12.
 */
public class BeanTest {
    public static void main(String[] args) throws Exception{
        ApplicationContext ctx = new ClassPathXmlApplicationContext("beans.xml");

        Person p = ctx.getBean("person",Person.class);
        p.useAxe();
    }
}
