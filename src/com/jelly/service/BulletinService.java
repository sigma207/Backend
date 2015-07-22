package com.jelly.service;

import com.jelly.pojo.Bulletin;
import org.springframework.cache.annotation.Cacheable;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

/**
 * Created by user on 2015/6/12.
 */
public class BulletinService {
    DateFormat df = new SimpleDateFormat("HH:mm:ss");
    List<Bulletin> bulletinList = new ArrayList<>();
    @Cacheable(value = "bulletinListCache")
    public List<Bulletin> getBulletinList(){
        System.out.println(df.format(Calendar.getInstance().getTime())+" getBulletinList");
        getBulletinListFromDB();
        return bulletinList;
    }

    @Cacheable(value = "bulletinListDateRangeCache")
    public List<Bulletin> getBulletinList(String beginDate,String endDate){
        System.out.println(df.format(Calendar.getInstance().getTime())+" getBulletinListDateRange");
        getBulletinListFromDB();
        return bulletinList;
    }
    private void getBulletinListFromDB(){
//        List<Bulletin> bulletinList = new ArrayList<Bulletin>();
        bulletinList.clear();
        int count = (int)(Math.random()*10);
        for(int i=0;i<count;i++){
            bulletinList.add(new Bulletin("title"+i,"content"+i));
        }
//        return bulletinList;
    }

    public void update(){
        getBulletinListFromDB();
    }
}
