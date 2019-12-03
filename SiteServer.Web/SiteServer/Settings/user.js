﻿var $url = '/pages/settings/user';
var $urlUpload = apiUrl + '/pages/settings/user/actions/import';

var data = {
  pageLoad: false,
  pageAlert: null,
  items: null,
  count: null,
  groups: null,
  formInline: {
    state: '',
    groupId: -1,
    order: '',
    lastActivityDate: 0,
    keyword: '',
    currentPage: 1,
    offset: 0,
    limit: 30
  },
  uploadPanel: false,
  uploadLoading: false,
  uploadList: []
};

var methods = {
  getConfig: function () {
    var $this = this;

    $api.get($url, {
      params: this.formInline
    }).then(function (response) {
      var res = response.data;

      $this.items = res.value;
      $this.count = res.count;
      $this.groups = res.groups;
    }).catch(function (error) {
      $this.pageAlert = utils.getPageAlert(error);
    }).then(function () {
      $this.pageLoad = true;
    });
  },

  btnEditClick: function(row) {
    location.href = 'userProfile.cshtml?userId=' + row.id;
  },

  btnPasswordClick: function(row) {
    location.href = 'userPassword.cshtml?userId=' + row.id;
  },

  btnExportClick: function() {
    var $this = this;
    
    utils.loading(true);
    $api.post($url + '/actions/export').then(function (response) {
      var res = response.data;

      window.open(res.value);
    }).catch(function (error) {
      $this.pageAlert = utils.getPageAlert(error);
    }).then(function () {
      utils.loading(false);
    });
  },

  btnDeleteClick: function (item) {
    var $this = this;

    utils.alertDelete({
      title: '删除用户',
      text: '此操作将删除用户 ' + item.userName + '，确定吗？',
      callback: function () {

        utils.loading(true);
        $api.delete($url, {
          data: {
            id: item.id
          }
        }).then(function (response) {
          var res = response.data;
    
          $this.items.splice($this.items.indexOf(item), 1);
        }).catch(function (error) {
          $this.pageAlert = utils.getPageAlert(error);
        }).then(function () {
          utils.loading(false);
        });
      }
    });
  },

  btnCheckClick: function(item) {
    utils.alertWarning({
      title: '审核用户',
      text: '此操作将设置用户 ' + item.userName + ' 的状态为审核通过，确定吗？',
      callback: function () {

        utils.loading(true);
        $api.post($url + '/actions/check', {
          id: item.id
        }).then(function (response) {
          var res = response.data;
    
          item.checked = true;
        }).catch(function (error) {
          $this.pageAlert = utils.getPageAlert(error);
        }).then(function () {
          utils.loading(false);
        });
      }
    });
  },

  btnLockClick: function(item) {
    utils.alertWarning({
      title: '锁定用户',
      text: '此操作将锁定用户 ' + item.userName + '，确定吗？',
      callback: function () {
        
        utils.loading(true);
        $api.post($url + '/actions/lock', {
          id: item.id
        }).then(function (response) {
          var res = response.data;
    
          item.locked = true;
        }).catch(function (error) {
          $this.pageAlert = utils.getPageAlert(error);
        }).then(function () {
          utils.loading(false);
        });
      }
    });
  },

  btnUnLockClick: function(item) {
    utils.alertWarning({
      title: '解锁用户',
      text: '此操作将解锁用户 ' + item.userName + '，确定吗？',
      callback: function () {

        utils.loading(true);
        $api.post($url + '/actions/unLock', {
          id: item.id
        }).then(function (response) {
          var res = response.data;
    
          item.locked = false;
        }).catch(function (error) {
          $this.pageAlert = utils.getPageAlert(error);
        }).then(function () {
          utils.loading(false);
        });
      }
    });
  },

  btnSearchClick() {
    var $this = this;

    utils.loading(true);
    $api.get($url, {
      params: this.formInline
    }).then(function (response) {
      var res = response.data;

      $this.items = res.value;
      $this.count = res.count;
    }).catch(function (error) {
      $this.pageAlert = utils.getPageAlert(error);
    }).then(function () {
      utils.loading(false);
    });
  },

  handleCurrentChange: function(val) {
    this.formInline.currentValue = val;
    this.formInline.offset = this.formInline.limit * (val - 1);

    this.btnSearchClick();
  },

  btnImportClick: function() {
    this.uploadPanel = true;
  },

  uploadBefore(file) {
    var isExcel = file.name.indexOf('.xlsx', file.name.length - '.xlsx'.length) !== -1;
    if (!isExcel) {
      this.$message.error('用户导入文件只能是 Excel 格式!');
    }
    return isExcel;
  },

  uploadProgress: function() {
    utils.loading(true)
  },

  uploadSuccess: function(res, file) {
    this.uploadPanel = false;

    var success = res.success;
    var failure = res.failure;
    var errorMessage = res.errorMessage;

    var $this = this;

    $api.get($url, {
      params: this.formInline
    }).then(function (response) {
      var res = response.data;

      $this.items = res.value;
      $this.count = res.count;
      $this.groups = res.groups;
    }).catch(function (error) {
      $this.pageAlert = utils.getPageAlert(error);
    }).then(function () {
      if (success) {
        $this.$message.success('成功导入 ' + success + ' 名用户！');
      }
      if (errorMessage) {
        $this.$message.error(failure + ' 名用户导入失败：' + errorMessage);
      }
      utils.loading(false);
    });
  },

  uploadError: function(err) {
    utils.loading(false);
    var error = JSON.parse(err.message);
    this.$message.error(error.message);
  }
};

new Vue({
  el: '#main',
  data: data,
  methods: methods,
  created: function () {
    this.getConfig();
  }
});