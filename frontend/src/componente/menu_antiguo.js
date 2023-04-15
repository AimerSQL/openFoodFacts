import React, { Component } from 'react'
import { Nav } from 'react-bootstrap';
import { NavDropdown } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import InputGroup from 'react-bootstrap/InputGroup';
import { withRouter, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

export default class Menu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: ''
        }
    }

    obtenerId = (e) => {
        this.setState({
            id: e.target.value
        })
    }

    render() {
        return (
            <>
                <Nav className="mt-2">
                    <NavDropdown title="Menu" id="nav-dropdown">
                        <NavDropdown.Item href="/">productos</NavDropdown.Item>
                        <NavDropdown.Item href="/grafica">graficas</NavDropdown.Item>
                    </NavDropdown>
                    <Form>
                        <Row className="align-items-center">
                            <Col xs="auto">
                                <InputGroup className="mb-2">
                                    <Form.Control id="inlineFormInputGroup" onChange={this.obtenerId} placeholder="Buscar un producto" />
                                </InputGroup>
                            </Col>
                            <Col xs="auto">
                                <Link to={`/foodInfo/${this.state.id}`}>
                                    <Button type="primary" icon={<SearchOutlined />} size={'large'}>
                                        Buscar
                                    </Button>
                                </Link>
                            </Col>
                        </Row>
                    </Form>
                </Nav>
            </>
        )
    }
}
