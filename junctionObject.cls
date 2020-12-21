public with sharing class getChildRecords {
    @AuraEnabled(cacheable=true)
    public static list<Child_Object__c> getChildRecords() {
        return [SELECT Name, OwnerId FROM Child_Object__c];
    }

    @AuraEnabled
    public static list<Junction_Object__c> createJunctionRecords(list<sObject> childList, Id parentRecordId) {
        list <Junction_Object__c> junctionRecordsToInsert= new List<Junction_Object__c>();
        for(sObject childRecord : childList) {
            Junction_Object__c junctionRecordToInsert = new Junction_Object__c();
                junctionRecordToInsert.Parent_Object__c = parentRecordId;
                junctionRecordToInsert.Child_Object__c = childRecord.Id;
                //junctionRecordToInsert.Name = childRecord.Name = + 'Junction record';
            junctionRecordsToInsert.add(junctionRecordToInsert);  
        }
        insert junctionRecordsToInsert;
        return junctionRecordsToInsert;
    }
}
