package com.jelly.ehcache;

import net.sf.ehcache.CacheException;
import net.sf.ehcache.Ehcache;
import net.sf.ehcache.Element;
import net.sf.ehcache.event.CacheEventListener;

/**
 * Created by user on 2015/7/6.
 */
public class MyCacheEventListener implements CacheEventListener {
    @Override
    public void notifyElementRemoved(Ehcache ehcache, Element element) throws CacheException {
        System.out.println(element.getKey() + " was removed.");
    }

    @Override
    public void notifyElementPut(Ehcache ehcache, Element element) throws CacheException {
//        System.out.println("calculateOffHeapSize="+ehcache.calculateOffHeapSize());
//        System.out.println("calculateInMemorySize=" + ehcache.calculateInMemorySize());
//        System.out.println("getSize=" + ehcache.getSize());
        System.out.println(element.getKey() + " was added.");
    }

    @Override
    public void notifyElementUpdated(Ehcache ehcache, Element element) throws CacheException {
        System.out.println(element.getKey() + " was updated.");
    }

    @Override
    public void notifyElementExpired(Ehcache ehcache, Element element) {
//        System.out.println("calculateOffHeapSize="+ehcache.calculateOffHeapSize());
//        System.out.println("calculateInMemorySize="+ehcache.calculateInMemorySize());
//        System.out.println("getSize="+ehcache.getSize());
        System.out.println(element.getKey() + " was expired.");
    }

    @Override
    public void notifyElementEvicted(Ehcache ehcache, Element element) {
        System.out.println(element.getKey() + " was evicted.");
    }

    @Override
    public void notifyRemoveAll(Ehcache ehcache) {
        System.out.println("notifyRemoveAll.");
    }

    @Override
    public void dispose() {
        System.out.println("dispose.");
    }

    @Override
    public Object clone() throws CloneNotSupportedException{
        throw new CloneNotSupportedException("Singleton instance");
    }
}
