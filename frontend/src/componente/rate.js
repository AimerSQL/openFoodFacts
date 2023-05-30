import { Rate } from 'antd';
const Valoracion = ({ rate }) => (
  <>
    <p>manufacturing: <Rate disabled defaultValue={rate.manufacturingLike} /></p>
    <p>packaging: <Rate disabled defaultValue={rate.packagingLike} /></p>
    <p>palmoil: <Rate disabled defaultValue={rate.palmoilLike} /></p>
    <p>size: <Rate disabled defaultValue={rate.sizeLike} /></p>
    <p>storage: <Rate disabled defaultValue={rate.storageLike} /></p>
    <p>transport: <Rate disabled defaultValue={rate.transportLike} /></p>
  </>
);

export default Valoracion;
