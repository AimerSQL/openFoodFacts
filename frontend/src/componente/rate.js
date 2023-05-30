import { Rate } from 'antd';
const Valoracion = ({ rate }) => (
  <>
    <p>manufacturingLike: <Rate disabled defaultValue={rate.manufacturingLike} /></p>
    <p>packagingLike: <Rate disabled defaultValue={rate.packagingLike} /></p>
    <p>palmoilLike: <Rate disabled defaultValue={rate.palmoilLike} /></p>
    <p>sizeLike: <Rate disabled defaultValue={rate.sizeLike} /></p>
    <p>storageLike: <Rate disabled defaultValue={rate.storageLike} /></p>
    <p>transportLike: <Rate disabled defaultValue={rate.transportLike} /></p>
  </>
);

export default Valoracion;
