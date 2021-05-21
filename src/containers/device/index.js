import './style.css';
import { useState, useEffect, useRef } from "react";
import "../../../node_modules/react-grid-layout/css/styles.css"
import "../../../node_modules/react-resizable/css/styles.css";

import GridLayout from 'react-grid-layout';


const urlImageTest = "https://res.cloudinary.com/c81admanagementstorage/image/upload/v1620285988/Images/604c7c0cb58ead018da468b3/vl4hw7du4pckzvrowxrd.webp"
const urlvideoTest = "https://res.cloudinary.com/c81admanagementstorage/video/upload/v1620882023/Videos/6075bdb39710ee10e851b2e6/kigmjlkg9hhjrus48whn.webm"

const initLayout = [
    { i: 'b', x: 0, y: 0, w: 16, h: 1, isBounded: true },
    { i: 'c', x: 0, y: 5, w: 16, h: 8, isBounded: true },
];
const LayoutLandScape = () => {
    const refLayout = useRef();
    const [DeviceWidth, setDeviceWidth] = useState(1000);
    const [DeviceHeight, setDeviceHeight] = useState(1000);

    const [lay, setLay] = useState(initLayout);

    useEffect(() => {
        setDeviceWidth(window.innerWidth);
        setDeviceHeight(window.innerHeight);
    }, []);

    useEffect(() => {
        refLayout.current.childNodes[0].style.backgroundSize = "cover"
        refLayout.current.childNodes[0].style.backgroundImage = `url(${urlImageTest})`;

        refLayout.current.childNodes[1].style.backgroundColor = "black"
        refLayout.current.childNodes[1].innerHTML = `<video width='100%' height='100%' autoplay><source src="${urlvideoTest}" type='video/mp4'/></video>`
    }, [refLayout])

    return (
        <div className="device-1">
            <GridLayout
                className="layout"
                layout={lay}
                cols={16}
                isBounded={false}
                rowHeight={DeviceHeight / 9}
                autoSize={false}
                width={DeviceWidth}
                innerRef={refLayout}
                margin={[0, 0]}
                isDraggable={false}
                isResizable={false}
                isDroppable={false}
            >
                {lay.map((item, index) => {
                    return <div key={item.i} />
                })}
            </GridLayout>
        </div>
    );
}

export default LayoutLandScape;
