var sinhviena = [
  {"username":"test1","ten_mon":"KINH TẾ LƯỢNG","id_mon":"3749","nhiem_vu":"lam bai tap","thoi_gian_nhac_nho":"1485675600","deadline_nhiem_vu":"1485675600"},
  {"username":"test1","ten_mon":"KINH TẾ LƯỢNG","id_mon":"3749","nhiem_vu":"luyen ky nang","thoi_gian_nhac_nho":"1485675600","deadline_nhiem_vu":"1485675600"},
  {"username":"test1","ten_mon":"QUẢN TRỊ NGUỒN NHÂN LỰC","id_mon":"3748","nhiem_vu":"luyen ky nang","thoi_gian_nhac_nho":"1485675600","deadline_nhiem_vu":"1485675600"},
  {"username":"test1","ten_mon":"QUẢN TRỊ NGUỒN NHÂN LỰC","id_mon":"3748","nhiem_vu":"lam bai tap","thoi_gian_nhac_nho":"1485675600","deadline_nhiem_vu":"1485675600"},
  {"username":"test1","ten_mon":"KINH TẾ LƯỢNG","id_mon":"3749","nhiem_vu":"lam bai tap","thoi_gian_nhac_nho":"1485675600","deadline_nhiem_vu":"1485675600"},
  {"username":"test1","ten_mon":"toan","id_mon":"1111","nhiem_vu":"aaaaaaaa","thoi_gian_nhac_nho":"1485675600","deadline_nhiem_vu":"1485675600"},
  {"username":"test1","ten_mon":"KINH TẾ LƯỢNG","id_mon":"3749","nhiem_vu":"aaaaaaaaa","thoi_gian_nhac_nho":"1485675600","deadline_nhiem_vu":"1485675600"},
  {"username":"test1","ten_mon":"toan","id_mon":"1111","nhiem_vu":"aaaaaaaa","thoi_gian_nhac_nho":"1485675600","deadline_nhiem_vu":"1485675600"},
  {"username":"test1","ten_mon":"KINH TẾ LƯỢNG","id_mon":"3749","nhiem_vu":"luyen ky nang aaaaaa","thoi_gian_nhac_nho":"1485675600","deadline_nhiem_vu":"1485675600"},
  {"username":"test1","ten_mon":"QUẢN TRỊ NGUỒN NHÂN LỰC","id_mon":"3748","nhiem_vu":"luyen ky nang xxxx","thoi_gian_nhac_nho":"1485675600","deadline_nhiem_vu":"1485675600"},
  ]


var find_course = function(course_arr,name) {
if(course_arr.length===0) {
  return -1
}
else {
for(i=0;i<course_arr.length;i++) {
  if(course_arr[i].ten_mon === name) {
    return i
  }

  }
    return -1
  }
}



var good_obj_student = function(sv) {
  var mon = [];
  k=0;
  var good_obj = {}
  var i;
  good_obj.user_name = sv[0].user_name  
  console.log(sv[0].user_name)
    for (i=0;i<sv.length;i++) {
    course_index = find_course(mon,sv[i].ten_mon)
    if(course_index===-1) {
      mon_hoc = {
        "ten_mon":sv[i].ten_mon,
        "id_mon":sv[i].id_mon,
        "nhac_nho":[]
      }
      nhac_nho = {
        "nhiem_vu":sv[i].nhiem_vu,
        "deadline_nhiem_vu":sv[i].deadline_nhiem_vu,
        "thoi_gian_nhac_nho":sv[i].thoi_gian_nhac_nho
      }
      mon_hoc.nhac_nho.push(nhac_nho)
      mon.push(mon_hoc)
      str = JSON.stringify(mon[k],null,4)
    }
    else {
      temp_nhac_nho = { 
        "nhiem_vu":sv[i].nhiem_vu,
        "deadline_nhiem_vu":sv[i].deadline_nhiem_vu,
        "thoi_gian_nhac_nho":sv[i].thoi_gian_nhac_nho  
      }
      mon[course_index].nhac_nho.push(temp_nhac_nho) 

    }
  }
  good_obj.course = mon
  return good_obj
}
str = JSON.stringify(good_obj_student(sinhviena),null,4)
console.log(str)