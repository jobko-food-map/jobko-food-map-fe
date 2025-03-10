import useKakaoLoader from "@app/lib/useKakaoLoader";
import { Map, MapMarker } from "react-kakao-maps-sdk";

function KakaoMap() {
    // useKakaoLoader();
    return <>
        <h1>카카오 맵 테스트</h1>
        <Map // 지도를 표시할 Container
            id="map"
            center={{
                // 지도의 중심좌표
                lat: 33.450701,
                lng: 126.570667,
            }}
            style={{
                // 지도의 크기
                width: "100%",
                height: "350px",
            }}
            level={3} // 지도의 확대 레벨
        />
    </>;
}

export default KakaoMap;