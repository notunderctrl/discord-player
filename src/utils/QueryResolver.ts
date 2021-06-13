import { validateID, validateURL } from "ytdl-core";
import { YouTube } from "youtube-sr";
import { QueryType } from "../types/types";
// @ts-ignore
import { validateURL as SoundcloudValidateURL } from "soundcloud-scraper";

// scary things below *sigh*
const spotifySongRegex = /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:track\/|\?uri=spotify:track:)((\w|-){22})/;
const spotifyPlaylistRegex = /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:playlist\/|\?uri=spotify:playlist:)((\w|-){22})/;
const spotifyAlbumRegex = /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:album\/|\?uri=spotify:album:)((\w|-){22})/;
const vimeoRegex = /(http|https)?:\/\/(www\.|player\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|video\/|)(\d+)(?:|\/\?)/;
const facebookRegex = /(https?:\/\/)(www\.|m\.)?(facebook|fb).com\/.*\/videos\/.*/;
const reverbnationRegex = /https:\/\/(www.)?reverbnation.com\/(.+)\/song\/(.+)/;
const attachmentRegex =
    /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
// scary things above *sigh*

class QueryResolver {
    static resolve(query: string): QueryType {
        if (SoundcloudValidateURL(query, "track")) return QueryType.SOUNDCLOUD_TRACK;
        if (SoundcloudValidateURL(query, "playlist") || query.includes("/sets/")) return QueryType.SOUNDCLOUD_PLAYLIST;
        if (validateID(query) || validateURL(query)) return QueryType.YOUTUBE_SEARCH;
        if (YouTube.validate(query, "PLAYLIST_ID")) return QueryType.YOUTUBE_PLAYLIST;
        if (spotifySongRegex.test(query)) return QueryType.SPOTIFY_SONG;
        if (spotifyPlaylistRegex.test(query)) return QueryType.SPOTIFY_PLAYLIST;
        if (spotifyAlbumRegex.test(query)) return QueryType.SPOTIFY_ALBUM;
        if (vimeoRegex.test(query)) return QueryType.VIMEO;
        if (facebookRegex.test(query)) return QueryType.FACEBOOK;
        if (reverbnationRegex.test(query)) return QueryType.REVERBNATION;
        if (attachmentRegex.test(query)) return QueryType.ARBITRARY;

        return QueryType.YOUTUBE_SEARCH;
    }

    static getVimeoID(query: string): string {
        return QueryResolver.resolve(query) === QueryType.VIMEO
            ? query
                  .split("/")
                  .filter((x) => !!x)
                  .pop()
            : null;
    }
}

export { QueryResolver };
