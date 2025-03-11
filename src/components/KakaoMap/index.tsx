import { CustomOverlayMap, Map as KaKaoMap, MapMarker } from "react-kakao-maps-sdk";

const mockData = [{
    lat: 37.4955951,
    lng: 127.01373,
    title: "방이편백육분삼십 교대점",
    placeId: 1301035374
}, {
    lat: 37.4915507,
    lng: 127.0127617,
    title: "다선칼국수 교대직영점",
    placeId: 145941801
}, {
    lat: 37.4913609,
    lng: 127.0120469,
    title: "송계옥 교대점",
    placeId: 1621224124
}]

function KakaoMap() {
    return <>
        <h1>카카오 맵 테스트</h1>
        <h1>카카오 맵 테스트</h1>
        {/* 백엔드에서 마커 값을 가져와서 map을 돌려서 구현한다? */}
        <KaKaoMap
            id="map"
            center={{ // 지도 중앙 우리 회사
                lat: 37.4941971,
                lng: 127.0144358,
            }}
            style={{
                width: "100%",
                height: "500px",
            }}
            level={3}
        >
            {mockData.map((data, index) => (
                <>
                    <CustomOverlayMap position={{ lat: data.lat - 0.0002, lng: data.lng }}>
                        <div style={{ padding: "10px", backgroundColor: "white", border: "1px solid black" }}>
                            {data.title}
                        </div>
                    </CustomOverlayMap>
                    <MapMarker
                        onClick={() => {
                            window.open(`https://map.kakao.com/link/map/${data.placeId}`);
                        }}
                        key={index}
                        position={{
                            lat: data.lat,
                            lng: data.lng,
                        }}
                        title={data.title}
                    />
                </>
            ))}
        </KaKaoMap>
    </>;
}

export default KakaoMap;