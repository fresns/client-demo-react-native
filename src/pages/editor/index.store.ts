import { get } from "lodash";
import { observable } from "mobx";
import { useAppStore } from "../../../App.store";
import { buildStore } from "../../store";
import { BasicStore } from "../../../sdk/utilities";

class Data {
  title: string;
  draftType: "post" | "comment" | string = "post";
  draftOptions: any;
  did: string;
  fsid: string;
}

class Store extends BasicStore<Data> {
  @observable data = new Data();

  private appStore = useAppStore().store;

  init() {
    const { fresnsLang } = this.appStore.data;

    const options = this.options;
    const draftType = options.type || "post";
    const draftOptions = {
      commentPid: options.commentPid || null, // 评论专用 | 有值表示评论该帖子
      commentCid: options.commentCid || null, // 评论专用 | 有值表示回复该评论
      quotePid: options.quotePid || null, // 帖子专用 | 引用帖子
      gid: options.gid || null, // 帖子专用
      title: options.title || null, // 帖子专用
      content: options.content || null,
      isMarkdown: options.isMarkdown || null,
      isAnonymous: options.isAnonymous || null,
      commentPolicy: options.commentPolicy || null, // 帖子专用
      commentPrivate: options.content || null,
      gtid: options.isMarkdown || null,
      locationInfo: options.locationInfo || null,
    };
    const did = options.did;
    const fsid = options.fsid;

    this.setData({
      title: get(fresnsLang, "editor"),
      draftType,
      draftOptions,
      did,
      fsid,
    });
  }
}

export const useStore = buildStore(() => new Store());
