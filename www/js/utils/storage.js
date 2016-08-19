/**
 * Created by suiman on 15/11/10.
 */
//存储全局信息
define(['app'], function (app) {
    app
        .factory('Storage', function storageService() {
        var storage = window.localStorage;
        var json = window.JSON;
        return {
            set: set,
            get: get,
            clear: clear,
            remove: remove
        };
        function set(key, value) {
            storage.setItem(key, json.stringify(value));
        }
        function get(key) {
            var value = json.parse(storage.getItem(key));
            if (null != value) {
                return value;
            }
            return undefined;
        }
        function clear() {
            storage.clear();
        }
        function remove(key) {
            storage.removeItem(key);
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3RzL3V0aWxzL3N0b3JhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0dBRUc7QUFFSCxRQUFRO0FBRVIsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUMsVUFBUyxHQUFHO0lBQ3pCLEdBQUc7U0FDQSxPQUFPLENBQUMsU0FBUyxFQUFFO1FBRWxCLElBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7UUFDbEMsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztRQUV2QixNQUFNLENBQUM7WUFDTCxHQUFHLEVBQUUsR0FBRztZQUNSLEdBQUcsRUFBRSxHQUFHO1lBQ1IsS0FBSyxFQUFFLEtBQUs7WUFDWixNQUFNLEVBQUUsTUFBTTtTQUNmLENBQUM7UUFFRixhQUFhLEdBQUcsRUFBRSxLQUFLO1lBQ3JCLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUM5QyxDQUFDO1FBRUQsYUFBYSxHQUFHO1lBQ2QsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDN0MsRUFBRSxDQUFBLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ2pCLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDZixDQUFDO1lBQ0QsTUFBTSxDQUFDLFNBQVMsQ0FBQztRQUNuQixDQUFDO1FBRUQ7WUFDRSxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDbEIsQ0FBQztRQUVELGdCQUFnQixHQUFHO1lBQ2pCLE9BQU8sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDMUIsQ0FBQztJQUNILENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMifQ==