package com.jelly.service;

import com.jelly.pojo.Bulletin;
import org.springframework.cache.annotation.Cacheable;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by user on 2015/6/12.
 */
public class BulletinService {
    @Cacheable(value = "bulletinListCache")
    public List<Bulletin> getBulletinList(){
        System.out.println("getBulletinList");
        return getBulletinListFromDB();
    }

    private List<Bulletin> getBulletinListFromDB(){
        List<Bulletin> bulletinList = new ArrayList<Bulletin>();
        bulletinList.add(new Bulletin("title1","content1"));
        bulletinList.add(new Bulletin("title2","content2"));
        bulletinList.add(new Bulletin("title3","content3"));
        bulletinList.add(new Bulletin("title4","content4"));
        System.out.println("getBulletinListFromDB");
        return bulletinList;
    }
}
