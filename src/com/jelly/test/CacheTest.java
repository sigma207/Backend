package com.jelly.test;

import com.jelly.service.BulletinService;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * Created by user on 2015/6/12.
 */
public class CacheTest {
    public static void main(String[] args) throws Exception{
        ApplicationContext ctx = new ClassPathXmlApplicationContext("beans.xml");

        BulletinService service = (BulletinService)ctx.getBean("bulletinServiceBean");

        System.out.println("first query");
        service.getBulletinList();
        System.out.println("second query");
        service.getBulletinList();
    }
}
