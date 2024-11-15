import { get, isNil } from "lodash";
import { observable } from "mobx";
import { useAppStore } from "../../../../App.store";
import { BasicStore } from "../../../../sdk/utilities";
import { buildStore } from "../../../store";

class Data {
  newContent: string;
}

class Store extends BasicStore<Data> {
  @observable data = new Data();

  private appStore = useAppStore().store;

  handleProps(props) {
    const { post } = props;
    if (isNil(post)) {
      return;
    }

    const { fresnsLang } = this.appStore.data;
    let nickname = post.author.nickname;
    if (!post.author.status) {
      nickname = get(fresnsLang, "userDeactivate");
    }
    if (post.isAnonymous) {
      nickname = get(fresnsLang, "contentAuthorAnonymous");
    }

    const summaries = post.title || post.contentLength > 26 ? post.content.slice(0, 26) + "..." : post.content;
    const newContent = nickname + ": " + summaries;

    this.setData({
      newContent,
    });
  }
}

export const useStore = buildStore(() => new Store());
