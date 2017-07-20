var widgetId = Fliplet.Widget.getDefaultId();
var widgetData = Fliplet.Widget.getData(widgetId) || {};
var appName = '';
var organisationName = '';
var appIcon = '';
var appSettings = {};
var allAppData = [];
var appStoreSubmission = {};
var enterpriseSubmission = {};
var unsignedSubmission = {};
var notificationSettings = {};

/* FUNCTIONS */
String.prototype.toCamelCase = function() {
  return this.replace(/^([A-Z])|[^A-Za-z]+(\w)/g, function(match, p1, p2, offset) {
    if (p2) return p2.toUpperCase();
    return p1.toLowerCase();
  }).replace(/([^A-Z-a-z])/g, '').toLowerCase();
};

var createBundleID = function(orgName, appName) {
  return $.ajax({
    url: "https://itunes.apple.com/lookup?bundleId=com." + orgName + "." + appName,
    dataType: "jsonp"
  });
};

function loadAppStoreData() {

  $('#appStoreConfiguration [name]').each(function(i, el) {
    var name = $(el).attr("name");

    /* APP NAME */
    if (name === "fl-store-appName") {
      $('[name="' + name + '"]').val(appName);
      return;
    }

    /* APP SCREENSHOTS */
    if (name === "fl-store-screenshots") {
      var screenNames = '';
      if (appSettings.screensToScreenshot) {
        appSettings.screensToScreenshot.forEach(function(screen) {
          screenNames += screen.title + ", ";
        });
        screenNames = screenNames.replace(/\,[\s]$/g, '');
        appStoreSubmission.data.appScreenshots = appSettings.screensToScreenshot;
      }
      $('[name="' + name + '"]').val(screenNames);
      return;
    }

    /* CHECK COUNTRIES */
    if (name === "fl-store-availability") {
      $('[name="' + name + '"]').selectpicker('val', ((typeof appStoreSubmission.data[name] !== "undefined") ? appStoreSubmission.data[name] : []));
      return;
    }
    if (name === "fl-store-userCountry" || name === "fl-store-category1" || name === "fl-store-category2" || name === "fl-store-language") {
      $('[name="' + name + '"]').val((typeof appStoreSubmission.data[name] !== "undefined") ? appStoreSubmission.data[name] : '').trigger('change');
      return;
    }

    /* ADD KEYWORDS */
    if (name === "fl-store-keywords") {
      $('#' + name).tokenfield('setTokens', ((typeof appStoreSubmission.data[name] !== "undefined") ? appStoreSubmission.data[name] : ''));
    }

    /* ADD BUNDLE ID */
    if (name === "fl-store-bundleId" && typeof appStoreSubmission.data[name] === "undefined") {
      createBundleID(organisationName.toCamelCase(), appName.toCamelCase()).then(function(response) {
        if (response.resultCount === 0) {
          $('.bundleId-ast-text').html('com.' + organisationName.toCamelCase() + '.' + appName.toCamelCase());
          $('[name="' + name + '"]').val('com.' + organisationName.toCamelCase() + '.' + appName.toCamelCase());
        } else {
          $('.bundleId-ast-text').html('com.' + organisationName.toCamelCase() + '.' + appName.toCamelCase() + (response.resultCount + 1));
          $('[name="' + name + '"]').val('com.' + organisationName.toCamelCase() + '.' + appName.toCamelCase() + (response.resultCount + 1));
        }
      });
      return;
    }
    if (name === "fl-store-bundleId" && typeof appStoreSubmission.data[name] !== "undefined") {
      $('.bundleId-ast-text').html(appStoreSubmission.data[name]);
      $('[name="' + name + '"]').val(appStoreSubmission.data[name]);
      return;
    }
    if (name === "_fl-store-appDevPass" || name === "fl-store-appDevLogin") {
      return;
    }

    $('[name="' + name + '"]').val((typeof appStoreSubmission.data[name] !== "undefined") ? appStoreSubmission.data[name] : '');
  });

  if (appName !== '' && appIcon && appSettings.splashScreen && (appSettings.screensToScreenshot && appSettings.screensToScreenshot.lenght)) {
    if (appSettings.splashScreen.size && (appSettings.splashScreen.size[0] && appSettings.splashScreen.size[1]) < 2732) {
      $('.app-details-appStore .app-splash-screen').addClass('has-warning');
    }
    allAppData.push('appStore');
  } else {
    $('.app-details-appStore').addClass('required-fill');

    if (appName === '') {
      $('.app-details-appStore .app-list-name').addClass('has-error');
    }
    if (!appIcon) {
      $('.app-details-appStore .app-icon-name').addClass('has-error');
    }
    if (appSettings.splashScreen && appSettings.splashScreen.size && (appSettings.splashScreen.size[0] && appSettings.splashScreen.size[1]) < 2732) {
      $('.app-details-appStore .app-splash-screen').addClass('has-warning');
    }
    if (!appSettings.splashScreen) {
      $('.app-details-appStore .app-splash-screen').addClass('has-error');
    }
    if (!appSettings.screensToScreenshot || !appSettings.screensToScreenshot.lenght) {
      $('.app-details-appStore .app-screenshots').addClass('has-error');
    }
  }
}

function loadEnterpriseData() {

  $('#enterpriseConfiguration [name]').each(function(i, el) {
    var name = $(el).attr("name");

    /* ADD BUNDLE ID */
    if (name === "fl-ent-bundleId" && typeof enterpriseSubmission.data[name] === "undefined") {
      createBundleID(organisationName.toCamelCase(), appName.toCamelCase()).then(function(response) {
        if (response.resultCount === 0) {
          $('.bundleId-ent-text').html('com.' + organisationName.toCamelCase() + '.' + appName.toCamelCase());
          $('[name="' + name + '"]').val('com.' + organisationName.toCamelCase() + '.' + appName.toCamelCase());
        } else {
          $('.bundleId-ent-text').html('com.' + organisationName.toCamelCase() + '.' + appName.toCamelCase() + (response.resultCount + 1));
          $('[name="' + name + '"]').val('com.' + organisationName.toCamelCase() + '.' + appName.toCamelCase() + (response.resultCount + 1));
        }
      });
      return;
    }
    if (name === "fl-ent-bundleId" && typeof enterpriseSubmission.data[name] !== "undefined") {
      $('.bundleId-ent-text').html(enterpriseSubmission.data[name]);
      $('[name="' + name + '"]').val(enterpriseSubmission.data[name]);
      return;
    }
    if (name === "_fl-ent-appDevPass" || name === "fl-ent-appDevLogin") {
      return;
    }

    $('[name="' + name + '"]').val((typeof enterpriseSubmission.data[name] !== "undefined") ? enterpriseSubmission.data[name] : '');
  });

  if (appIcon && appSettings.splashScreen) {
    if (appSettings.splashScreen.size && (appSettings.splashScreen.size[0] && appSettings.splashScreen.size[1]) < 2732) {
      $('.app-details-ent .app-splash-screen').addClass('has-warning');
    }
    allAppData.push('enterprise');
  } else {
    $('.app-details-ent').addClass('required-fill');

    if (!appIcon) {
      $('.app-details-ent .app-icon-name').addClass('has-error');
    }
    if (appSettings.splashScreen && appSettings.splashScreen.size && (appSettings.splashScreen.size[0] && appSettings.splashScreen.size[1]) < 2732) {
      $('.app-details-ent .app-splash-screen').addClass('has-warning');
    }
    if (!appSettings.splashScreen) {
      $('.app-details-ent .app-splash-screen').addClass('has-error');
    }
  }
}

function loadUnsignedData() {

  $('#unsignedConfiguration [name]').each(function(i, el) {
    var name = $(el).attr("name");

    /* ADD BUNDLE ID */
    if (name === "fl-uns-bundleId" && typeof unsignedSubmission.data[name] === "undefined") {
      createBundleID(organisationName.toCamelCase(), appName.toCamelCase()).then(function(response) {
        if (response.resultCount === 0) {
          $('.bundleId-uns-text').html('com.' + organisationName.toCamelCase() + '.' + appName.toCamelCase());
          $('[name="' + name + '"]').val('com.' + organisationName.toCamelCase() + '.' + appName.toCamelCase());
        } else {
          $('.bundleId-uns-text').html('com.' + organisationName.toCamelCase() + '.' + appName.toCamelCase() + (response.resultCount + 1));
          $('[name="' + name + '"]').val('com.' + organisationName.toCamelCase() + '.' + appName.toCamelCase() + (response.resultCount + 1));
        }
      });
      return;
    }
    if (name === "fl-uns-bundleId" && typeof unsignedSubmission.data[name] !== "undefined") {
      $('.bundleId-uns-text').html(unsignedSubmission.data[name]);
      $('[name="' + name + '"]').val(unsignedSubmission.data[name]);
      return;
    }

    $('[name="' + name + '"]').val((typeof unsignedSubmission.data[name] !== "undefined") ? unsignedSubmission.data[name] : '');
  });

  if (appIcon && appSettings.splashScreen) {
    if (appSettings.splashScreen.size && (appSettings.splashScreen.size[0] && appSettings.splashScreen.size[1]) < 2732) {
      $('.app-details-uns .app-splash-screen').addClass('has-warning');
    }
    allAppData.push('unsigned');
  } else {
    $('.app-details-uns').addClass('required-fill');

    if (!appIcon) {
      $('.app-details-uns .app-icon-name').addClass('has-error');
    }
    if (appSettings.splashScreen && appSettings.splashScreen.size && (appSettings.splashScreen.size[0] && appSettings.splashScreen.size[1]) < 2732) {
      $('.app-details-uns .app-splash-screen').addClass('has-warning');
    }
    if (!appSettings.splashScreen) {
      $('.app-details-uns .app-splash-screen').addClass('has-error');
    }
  }
}

function loadPushNotesData() {
  $('#pushConfiguration [name]').each(function(i, el) {
    var name = $(el).attr("name");
    /* ADDING NOTIFICATIONS SETTINGS */
    if (name === 'fl-push-clientId') {
      $('[name="' + name + '"]').val(notificationSettings.wnsClientId || '');
      return;
    }
    if (name === 'fl-push-clientSecret') {
      $('[name="' + name + '"]').val(notificationSettings.wnsClientSecret || '');
      return;
    }
  });
}

function save(origin, submission) {
  Fliplet.App.Submissions.update(submission.id, submission.data).then(function() {
    $('.save-' + origin + '-progress').addClass('saved');

    setTimeout(function() {
      $('.save-' + origin + '-progress').removeClass('saved');
    }, 4000);
  });
}

function requestBuild(origin, submission) {
  $('.button-' + origin + '-request').html('Requesting <i class="fa fa-spinner fa-pulse fa-fw"></i>');

  if (origin === 'appStore') {
    submission.data.screensToScreenshot = appSettings.screensToScreenshot;
  }

  submission.data.splashScreen = appSettings.splashScreen;
  submission.data.appIcon = appIcon;

  Fliplet.App.Submissions.update(submission.id, submission.data).then(function() {

    Fliplet.App.Submissions.build(submission.id).then(function(response) {
      Fliplet.Studio.emit('refresh-app-submissions');

      $('.button-' + origin + '-request').html('Request App <i class="fa fa-paper-plane"></i>');
      $('.save-' + origin + '-request').addClass('saved');

      setTimeout(function() {
        $('.save-' + origin + '-request').removeClass('saved');
      }, 10000);
    }, function(err) {
      $('.button-' + origin + '-request').html('Request App <i class="fa fa-paper-plane"></i>');
      alert(err.responseJSON.message);
    });
  }).catch(function(err) {
    $('.button-' + origin + '-request').html('Request App <i class="fa fa-paper-plane"></i>');
    alert(err.responseJSON.message);
  });
}

function saveAppStoreData(request) {
  var data = appStoreSubmission.data;
  var pushData = notificationSettings;

  $('#appStoreConfiguration [name]').each(function(i, el) {
    var name = $(el).attr("name");
    var value = $(el).val();

    /* PROCESSING KEYWORDS */
    if (name === 'fl-store-keywords') {
      var newValue = value.replace(/,\s+/g, ',');
      data[name] = newValue;
      return;
    }

    data[name] = value;
  });

  appStoreSubmission.data = data;
  notificationSettings = pushData;

  if (request) {
    requestBuild('appStore', appStoreSubmission);
  } else {
    save('appStore', appStoreSubmission);
  }
}

function saveEnterpriseData(request) {
  var data = enterpriseSubmission.data;
  var pushData = notificationSettings;

  $('#enterpriseConfiguration [name]').each(function(i, el) {
    var name = $(el).attr("name");
    var value = $(el).val();

    data[name] = value;
  });

  enterpriseSubmission.data = data;
  notificationSettings = pushData;

  if (request) {
    requestBuild('enterprise', enterpriseSubmission);
  } else {
    save('enterprise', enterpriseSubmission);
  }
}

function saveUnsignedData(request) {
  var data = unsignedSubmission.data;

  $('#unsignedConfiguration [name]').each(function(i, el) {
    var name = $(el).attr("name");
    var value = $(el).val();

    data[name] = value;
  });

  unsignedSubmission.data = data;

  if (request) {
    requestBuild('unsigned', unsignedSubmission);
  } else {
    save('unsigned', unsignedSubmission);
  }
}

function savePushData() {
  var data = notificationSettings;

  $('#pushConfiguration [name]').each(function(i, el) {
    var name = $(el).attr("name");
    var value = $(el).val();

    if (name === 'fl-push-clientId') {
      data.wnsClientId = value;
      return;
    }
    if (name === 'fl-push-clientSecret') {
      data.wnsClientSecret = value;
      return;
    }
  });

  data.wns = !!((data.wnsClientId && data.wnsClientId !== '') && (data.wnsClientSecret && data.wnsClientSecret !== ''));

  notificationSettings = data;

  if (notificationSettings.wns) {
    Fliplet.API.request({
      method: 'PUT',
      url: 'v1/widget-instances/com.fliplet.push-notifications?appId=' + Fliplet.Env.get('appId'),
      data: notificationSettings
    }).then(function() {
      $('.save-push-progress').addClass('saved');

      setTimeout(function() {
        $('.save-push-progress').removeClass('saved');
      }, 4000);
    });
  }
}

function init() {
  /* APP ICON */
  if (appIcon) {
    $('.setting-app-icon.userUploaded').attr('src', appIcon);
    $('.setting-app-icon.userUploaded').removeClass('hidden');
    $('.setting-app-icon.default').addClass('hidden');
  }

  /* APP SPLASH SCREEN */
  if (appSettings.splashScreen) {
    $('.setting-splash-screen.userUploaded').css('background-image', 'url(' + appSettings.splashScreen.url + ')');
    $('.setting-splash-screen.userUploaded').removeClass('hidden');
    $('.setting-splash-screen.default').addClass('hidden');
  }

  loadAppStoreData();
  loadEnterpriseData();
  loadUnsignedData();
  loadPushNotesData();
  Fliplet.Widget.autosize();
}

/* AUX FUNCTIONS */
function checkGroupErrors() {
  $('.has-error').each(function(i, el) {
    $(el).parents('.panel-default').addClass('required-fill');
  });

  $('.panel-default').each(function(i, el) {
    var withError = $(el).find('.has-error').length;

    if (withError === 0) {
      $(el).not('.app-details-appStore, .app-details-ent, .app-details-uns').removeClass('required-fill');
    }
  });
}

/* ATTACH LISTENERS */
$('[name="submissionType"]').on('change', function() {
  var selectedOptionId = $(this).attr('id');

  $('.fl-sb-panel').removeClass('show');
  $('.' + selectedOptionId).addClass('show');

  Fliplet.Widget.autosize();
});

$('.fl-sb-appStore [change-bundleid], .fl-sb-enterprise [change-bundleid], .fl-sb-unsigned [change-bundleid]').on('click', function() {
  var changeBundleId = confirm("Are you sure you want to change the unique Bundle ID?");

  if (changeBundleId) {
    $('.fl-bundleId-holder').addClass('hidden');
    $('.fl-bundleId-field').addClass('show');

    Fliplet.Widget.autosize();
  }
});

$('.panel-group').on('shown.bs.collapse', '.panel-collapse', function() {
    Fliplet.Widget.autosize();
  })
  .on('hidden.bs.collapse', '.panel-collapse', function() {
    Fliplet.Widget.autosize();
  });

$('a[data-toggle="tab"').on('shown.bs.tab', function() {
    Fliplet.Widget.autosize();
  })
  .on('hidden.bs.tab', function() {
    Fliplet.Widget.autosize();
  });

$('[name="fl-store-keywords"]').on('tokenfield:createtoken', function(e) {
  var currentValue = e.currentTarget.value.replace(/,\s+/g, ',');
  var newValue = e.attrs.value;
  var oldAndNew = currentValue + ',' + newValue;

  if (oldAndNew.length > 100) {
    e.preventDefault();
  }
});

$('.redirectToSettings, [data-change-settings]').on('click', function(event) {
  event.preventDefault();

  Fliplet.Studio.emit('navigate', {
    name: 'appSettings',
    params: {
      appId: Fliplet.Env.get('appId')
    }
  });
});

$('[data-change-assets]').on('click', function(event) {
  event.preventDefault();

  Fliplet.Studio.emit('navigate', {
    name: 'launchAssets',
    params: {
      appId: Fliplet.Env.get('appId')
    }
  });
});

$('#appStoreConfiguration, #enterpriseConfiguration, #unsignedConfiguration').on('validated.bs.validator', function() {
  checkGroupErrors();
  Fliplet.Widget.autosize();
});

$('#appStoreConfiguration').validator().on('submit', function(event) {
  if (event.isDefaultPrevented()) {
    // Gives time to Validator to apply classes
    setTimeout(checkGroupErrors, 0);
    alert('Please fill in all the required information.');
    return;
  }

  event.preventDefault();

  if (allAppData.indexOf('appStore') > -1) {
    saveAppStoreData(true);
  } else {
    alert('Please configure your App Settings to contain the required information.');
  }
  // Gives time to Validator to apply classes
  setTimeout(checkGroupErrors, 0);
});

$('#enterpriseConfiguration').validator().on('submit', function(event) {
  if (event.isDefaultPrevented()) {
    // Gives time to Validator to apply classes
    setTimeout(checkGroupErrors, 0);
    alert('Please fill in all the required information.');
    return;
  }

  event.preventDefault();

  if (allAppData.indexOf('enterprise') > -1) {
    saveEnterpriseData(true);
  } else {
    alert('Please configure your App Settings to contain the required information.');
  }
  // Gives time to Validator to apply classes
  setTimeout(checkGroupErrors, 0);
});

$('#unsignedConfiguration').validator().on('submit', function(event) {
  if (event.isDefaultPrevented()) {
    // Gives time to Validator to apply classes
    setTimeout(checkGroupErrors, 0);
    alert('Please fill in all the required information.');
    return;
  }

  event.preventDefault();

  if (allAppData.indexOf('unsigned') > -1) {
    saveUnsignedData(true);
  } else {
    alert('Please configure your App Settings to contain the required information.');
  }
  // Gives time to Validator to apply classes
  setTimeout(checkGroupErrors, 0);
});

/* SAVE PROGRESS CLICK */
$('[data-app-store-save]').on('click', function() {
  saveAppStoreData();
});
$('[data-enterprise-save]').on('click', function() {
  saveEnterpriseData();
});
$('[data-unsigned-save]').on('click', function() {
  saveUnsignedData();
});
$('[data-push-save]').on('click', function() {
  savePushData();
});

/* INIT */
$('#appStoreConfiguration, #enterpriseConfiguration, #unsignedConfiguration').validator().off('focusout.bs.validator');
$('[name="submissionType"][value="appStore"]').prop('checked', true).trigger('change');

function submissionChecker(submissions) {
  appStoreSubmission = _.find(submissions, function(submission) {
    return submission.data.submissionType === "appStore" && submission.platform === "windows";
  });

  enterpriseSubmission = _.find(submissions, function(submission) {
    return submission.data.submissionType === "enterprise" && submission.platform === "windows";
  });

  unsignedSubmission = _.find(submissions, function(submission) {
    return submission.data.submissionType === "unsigned" && submission.platform === "windows";
  });

  if (_.isEmpty(appStoreSubmission)) {
    Fliplet.App.Submissions.create({
        platform: 'windows',
        data: {
          submissionType: "appStore"
        }
      })
      .then(function(submission) {
        appStoreSubmission = submission;
      });
  }

  if (_.isEmpty(enterpriseSubmission)) {
    Fliplet.App.Submissions.create({
        platform: 'windows',
        data: {
          submissionType: "enterprise"
        }
      })
      .then(function(submission) {
        enterpriseSubmission = submission;
      });
  }

  if (_.isEmpty(unsignedSubmission)) {
    Fliplet.App.Submissions.create({
        platform: 'windows',
        data: {
          submissionType: "unsigned"
        }
      })
      .then(function(submission) {
        unsignedSubmission = submission;
      });
  }
}

Fliplet.App.Submissions.get()
  .then(function(submissions) {
    if (!submissions.length) {
      return Promise.all([
        Fliplet.App.Submissions.create({
          platform: 'windows',
          data: {
            submissionType: "appStore"
          }
        })
        .then(function(submission) {
          appStoreSubmission = submission;
        }),
        Fliplet.App.Submissions.create({
          platform: 'windows',
          data: {
            submissionType: "unsigned"
          }
        })
        .then(function(submission) {
          unsignedSubmission = submission;
        }),
        Fliplet.App.Submissions.create({
          platform: 'windows',
          data: {
            submissionType: "enterprise"
          }
        })
        .then(function(submission) {
          enterpriseSubmission = submission;
        })
      ]);
    }

    submissionChecker(submissions);
    return Promise.resolve();
  })
  .then(function() {
    // Fliplet.Env.get('appId')
    // Fliplet.Env.get('appName')
    // Fliplet.Env.get('appSettings')

    return Promise.all([
      Fliplet.API.request({
        cache: true,
        url: 'v1/apps/' + Fliplet.Env.get('appId')
      })
      .then(function(result) {
        appName = result.app.name;
        appIcon = result.app.icon;
        appSettings = result.app.settings;
      }),
      Fliplet.API.request({
        cache: true,
        url: 'v1/organizations/' + Fliplet.Env.get('organizationId')
      })
      .then(function(org) {
        organisationName = org.name;
      })
    ]);
  })
  .then(function() {
    return Fliplet.API.request({
      method: 'GET',
      url: 'v1/widget-instances/com.fliplet.push-notifications?appId=' + Fliplet.Env.get('appId')
    });
  }).then(function(response) {
    if (response.widgetInstance.settings && response.widgetInstance.settings) {
      notificationSettings = response.widgetInstance.settings;
    } else {
      notificationSettings = {};
    }

    init();
  });
