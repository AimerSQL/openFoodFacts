import React, { Component } from 'react'
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const axios = require('axios');

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productos: [],
    }
  }

  async componentDidMount() {
    await axios.get('http://localhost:4000/food').then(response => {
      this.setState({
        productos: response.data
      })
    })
  }

  search = (id) => {
    console.log(id)
  }

  render() {
    return (
      <>

        <Row xs={1} md={4} className="g-4">
          {this.state.productos.map(p => {
            return (
              <Col>
                <Card style={{ width: '10rem' }}>
                  <Card.Body>
                    {p.img ? <Card.Img variant="top" src={p.img} onClick={() => this.search(p.id)} /> : <Card.Img variant="top" src="https://images.openfoodfacts.org/images/products/841/036/802/7731/front_fr.12.400.jpg" onClick={() => this.search(p.id)} />}
                    <Card.Title>{p.product_name}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            )
          }
          )}
        </Row>
      </>
    )
  }
}
