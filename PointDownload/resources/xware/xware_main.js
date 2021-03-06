// http://yuancheng.xunlei.com/3/

var spliterBtwData = "#..#";
var spliterEnd = "#.^_^.#";
var pointReflashDownloadListIntervalId = 0;  // timer id (feedback the tasks information)
var pointIsReflashDownloadListTimerStarted = false;  // is the timer start

// ======================= Bind Singals ======================= //
Point.sJSGetAllBindedPeerIds.connect(pointSlotGetAllBindedPeerIds);
Point.sJSReflashDownloadList.connect(pointSlotReflashDownloadList);

// add new task
Point.sJSAddNewDownloadTask.connect(pointAddNewDownloadTask);
//Point.sAddNewBTDownloadTask.connect(pointAddNewBTDownloadTask);

// task controller
Point.sJSSuspendDownloadingTask.connect(pointSuspendDownloadingTask);
Point.sJSResumeDownloadingTask.connect(pointResumeDownloadingTask);
Point.sJSRemoveDownloadingTask.connect(pointRemoveDownloadingTask);
Point.sJSEntryOfflineChannel.connect(pointEntryOfflineChannel);
Point.sJSEntryHighSpeedChannel.connect(pointEntryHighSpeedChannel);
Point.sJSUrlParse.connect(pointUrlParse);

// set default downloader
Point.sSetDefaultDownloader.connect(pointSetDefaultDownloader);

// logout
Point.sJSLogout.connect(pointLogout);
// ======================================================== //


// ========================== init ============================ //
var feedbackTaskInfoInterval = 1000;
var addNewDownloadTask = false;
var pointLocalDownloaderPid = "";

// feedback the message to point
App.bind("functions.msgbox.show",
            function(e) {

                if(e)
                {
                    Point.feedbackMsgboxMessage(App.select("#d-msgbox-message").html());
                }

            });

// if have not clicked the downloader then it become online, the controlling of task will not work
var pointReloadDownloaderInterval = setInterval(
function()
{
    Point.justForJSTest(".. downloader offline, please wait for thunder response ..");

    if(pointLocalDownloaderPid !== "")
    {
        $("#downloader-list>li").each(
            function()
            {
                if($(this).attr("data-pid") === pointLocalDownloaderPid)
                {
                    // if the downloader ture out online status
                    if($(this).find(".ico_online").length > 0)
                    {
                        $(this).click();
                        window.clearInterval(pointReloadDownloaderInterval);

                        Point.justForJSTest(".. downloader online ..");

                        // hide the msgbox if exits
                        App.set("functions.msgbox.show", 0);
                    }
                }
            });
    }
}, 1000);

// for add new task and parse url
App.bind("si.urlInfo",
    function(e)
    {
        Point.justForJSTest("-------------- si.urlInfo ---------------");
        Point.justForJSTest(e.name);

        // add new download task
        if(addNewDownloadTask)
        {
            // handle  storage    fileList

            addNewDownloadTask = false;
            App.set("dialogs.createTask.confirmEVT", true);
            App.set("dialogs.createTask.show", false);
            Point.justForJSTest("--------------- confirmEVT (add new download) --------------------");
        }

        // parse url
        else
        {
            var taskFileList = "";
            var fileName = "";
            var fileSize = "";

            // add bt name
            if(App.get("si.urlInfoHash"))
            {
                fileName = e.name;
                fileSize = "-1";
                taskFileList += fileName + spliterBtwData + fileSize + spliterEnd;
            }

            $("#d-create-task-file-list > li").each
            (
                function ()
                {
                    // bt or magnet
                    if(App.get("si.urlInfoHash"))
                    {
                        fileName = $(this).find(".pop_al_02").html();
                    }
                    // common url
                    else
                    {
                        fileName = $(this).find("p > input").attr("value");
                    }

                    fileSize = $(this).find(".pop_al_03").html();
                    taskFileList += fileName + spliterBtwData + fileSize + spliterEnd;
                }
            );
            Point.feedbackURLParse(taskFileList);
            App.set("dialogs.createTask.show", false);

            Point.justForJSTest("-------------- feedback url parse ---------------");
        }
    }
);

// ======================================================== //



// parse url like magnet, ftp ...
function pointUrlParse(url)
{
    App.set("dialogs.createTask.show", false);

    App.set("dialogs.createTask.show", true);  // this can be removed
    $("#d-create-task-url").val(url).keyup().get(0).focus();
    App.set("dialogs.createTask.confirmEVT", true);
}

function pointAddNewDownloadTask(url, storage, fileList)
{
    Point.justForJSTest("----------------- pointAddNewDownloadTask -----------------------");
    Point.justForJSTest(url);

    addNewDownloadTask = true;
    App.set("dialogs.createTask.show", false);
    App.set("dialogs.createTask.show", true);  // this can be removed
    $("#d-create-task-url").val(url).keyup().get(0).focus();
    App.set("dialogs.createTask.confirmEVT", true);

    // globleStorage = storage;
    // globleFileList = fileList;

    addNewDownloadTask = true;
}

function pointLogout()
{
/*
    // ======================= disconnect Singals ======================= //
    Point.sJSGetAllBindedPeerIds.disconnect(pointSlotGetAllBindedPeerIds);
    Point.sJSReflashDownloadList.disconnect(pointSlotReflashDownloadList);

    // add new task
    Point.sJSAddNewDownloadTask.disconnect(pointAddNewDownloadTask);
    //Point.sAddNewBTDownloadTask.disconnect(pointAddNewBTDownloadTask);

    // task controller
    Point.sJSSuspendDownloadingTask.disconnect(pointSuspendDownloadingTask);
    Point.sJSResumeDownloadingTask.disconnect(pointResumeDownloadingTask);
    Point.sJSRemoveDownloadingTask.disconnect(pointRemoveDownloadingTask);
    Point.sJSEntryOfflineChannel.disconnect(pointEntryOfflineChannel);
    Point.sJSEntryHighSpeedChannel.disconnect(pointEntryHighSpeedChannel);
    Point.sJSUrlParse.disconnect(pointUrlParse);

    // set default downloader
    Point.sSetDefaultDownloader.disconnect(pointSetDefaultDownloader);

    // logout
    Point.sJSLogout.disconnect(pointLogout);
    // ======================================================== //
*/

    // debugger
    Point.justForJSTest("----------------- logOut -----------------------");

    App.set("exit", true);
}

// ================================== task controller ==================================== //
function pointSuspendDownloadingTask(tid)
{
    // debugger
    Point.justForJSTest("----------------- suspend -----------------------" + tid);
    App.set("task.pause", tid);
}

function pointResumeDownloadingTask(tid)
{
    // debugger
    Point.justForJSTest("----------------- resume -----------------------" + tid);

    App.set("task.start", tid);
}

function pointRemoveDownloadingTask(tid)
{
    // debugger
    Point.justForJSTest("----------------- remove -----------------------" + tid);

    App.set("dialogs.removeTasks.checked", 1);
    App.set("task.remove", tid);
    App.set("dialogs.removeTasks.confirmEVT", 1);
}


function pointEntryOfflineChannel(tid)
{
    // debugger
    Point.justForJSTest("----------------- Entry Offline Channel -----------------------" + tid);

    App.set("task.activeLixian", tid);
}

function pointEntryHighSpeedChannel(tid)
{
    // debugger
    Point.justForJSTest("----------------- Entry High Speed Channel -----------------------" + tid);

    App.set("task.activeGaosu", tid);
}

// ================================================================================== //

function pointSlotGetAllBindedPeerIds()
{
    var peerList = "";
    $("#d-create-task-downloader-list>li").each(
    function()
    {
        peerList += $(this).attr("data-pid") + spliterBtwData;
    });

    Point.setAllBindedPeerIds(peerList);
}

// @Deprecated, Replace by json on XwareTaskEntity
function pointRefashDloadListTimer()
{
    var allTaskInfo = '';

    $("#task-list>div").each(
    function()
    {
        var $taskDiv, tid, taskName, size, progress, speed, remain, state, url, highSpeed, offlineSpeed, ta = G("task.all");;
        tid = $(this).attr("data-tid");
        $taskDiv = $("#task-list > div[data-tid="+tid+"]");
        taskName = $taskDiv.find(".rw_u02").find(".rw_p_name").html();
        size = $taskDiv.find(".rw_u02").find(".rw_sp_size").html();
        progress = $taskDiv.find(".rw_u03").find(".rw_pr_num").html();
        speed = $taskDiv.find(".rw_u03").find(".rw_pr_speed").html();
        remain = $taskDiv.find(".rw_u03").find(".rw_pr_time").html();
        state = $taskDiv.find(".rw_u02>div>i").attr("class");
        url = ta[tid].url;

        var $taskDiv2 = $("#task-list > div[data-tid="+tid+"] > div.rw_u_add > div.rw_u03 > div.rw_u_btn");
        highSpeed = $taskDiv2.find("span.fail_gs > span").html();
        offlineSpeed = $taskDiv2.find("span.fail_lx > span").html();

        var allTaskInfo_temp = tid+spliterBtwData+taskName+spliterBtwData+size+spliterBtwData+progress
                +spliterBtwData+speed+spliterBtwData+remain+spliterBtwData+state+spliterBtwData+url
                +spliterBtwData+highSpeed+spliterBtwData+offlineSpeed+spliterEnd;
        allTaskInfo += allTaskInfo_temp;
    }
    );

    Point.feedbackDownloadList(allTaskInfo);
}


function pointSlotReflashDownloadList()
{
    Point.justForJSTest("... start feedbacking task info ...");

    if(!pointIsReflashDownloadListTimerStarted)
    {
        // setInterval
        pointReflashDownloadListIntervalId = setInterval("pointRefashDloadListTimer()", feedbackTaskInfoInterval);
        pointIsReflashDownloadListTimerStarted = true;
    }
}

// stop feedback the task content
function pointStopPointInterval()
{
    window.clearInterval(pointReflashDownloadListIntervalId);
}

function pointSetDefaultDownloader(peerId)
{
    pointLocalDownloaderPid = peerId;
    $("#manage-list > li[data-pid="+peerId+"]").click();
}

function pointBindNewMachine(code)
{
    if(code === "")
    {
        Point.justForJSTest("  router code is empty, return  ");
        return;
    }

    pointPopDownloader();

    $pop_sjbox_div = $("#d-add-downloader-panels > div.pop_addd_unit > div.pop_de_inp > div.pop_sjbox");
    $pop_sjbox_div.find(".sel_txt > input.sel_inptxt").val(code).blur().trigger('input');
    $pop_sjbox_div.find("a.btn_inp").click();

    // hide the msgbox if exits
    App.set("functions.msgbox.show", 0);
}

function pointPopDownloader()
{
    $ds = $("#manage-list>li");
    if( $ds.length > 5)
    {
        var old = "";
        var dloader  = "";
        $ds.each(function(){
            var str  = $(this).find(".managebox_info>.managebox_p5>span:last").html();
            str = str.replace(/-/g,"/");
            if(old === "")
            {
                old = str;
                dloader = $(this).attr("data-pid");
            }
            else if((new Date(old) -  new Date(str)) > 0)
            {
                old = str;
                dloader = $(this).attr("data-pid");
            }
        });
        Point.justForJSTest("cleans a downloader : " + dloader)
        pointUnbindMachine(dloader);
    }
}

function pointUnbindMachine(pid)
{
    // this may delete the wrong downloader, I dont konw why yet.
    $("#downloader-list>li[data-pid="+pid+"]>div").find("a[title='解除绑定']").click();

    // click confirm
    App.set("dialogs.removeDownloader.confirmEVT", true);
}
