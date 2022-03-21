import React, { useState,useEffect, useCallback } from 'react'
import { Card, Form, FormLayout, TextField, Button, ColorPicker, Layout } from '@shopify/polaris'
import '../index.css';

function Home() {
    const [quote, setQuote] = useState('')
    const [color, setColor] = useState({
        hue: 300,
        brightness: 1,
        saturation: 0.7,
        alpha: 0.7,
    });
    const [res, setRes] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    var [cl,setCl]=useState([]);

    function hsvTohsl(h, s, v,a) {
        var l = (2 - s) * v / 2;
        if (l !== 0) {
            if (l === 1) {
                s = 0;
            } else if (l < 0.5) {
                s = s * v / (l * 2);
            } else {
                s = s * v / (2 - l * 2);
            }
        }
        setCl([h,s,l,a]);
    }

    const handleQuoteChange = useCallback((value) => {
        setRes('')
        setQuote(value);
    }, []);

    useEffect(() => {
       // console.log("inside use effect");
        hsvTohsl(color.hue, color.saturation, color.brightness,color.alpha);
      },[color]);
     
    const cUrl = window.location.href.toString()
    const serverUrl = cUrl.substr(0, cUrl.length - 1)


    const onFormSubmit = ev => {
        setRes('')
        setIsLoading(true)
        ev.preventDefault()
        if (color !== '' && quote !== '') {
            fetch(`${serverUrl}/generatequote`, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({ quote, color })
            }).then(res => res.json())
                .then(data => {
                    setIsLoading(false)
                    setRes(data)
                })
                .catch(err => console.log(err))
        } else {
            alert('All fields are required!')
        }
    }

    return (
        <div className="container mt-30">
          <div>
          <h1 style={{ textAlign: 'center', margin: '4%', fontSize: '2.5em' }}>
        Color Your Quote<br /><br /></h1>
          </div>
            <Layout>
                <Layout.Section oneThird>
                    <Card title="Generate Your Colored Quote">
                        <Card.Section>
                            <Form onSubmit={onFormSubmit}>
                                <FormLayout>
                                    <TextField
                                        label="Quote"
                                        value={quote}
                                        onChange={handleQuoteChange}
                                        type="text"
                                        autoComplete="off"
                                        helpText={
                                            <span>
                                                Enter your quote in the above field.
                                            </span>
                                        }
                                    />
                                    <ColorPicker label="Select Color" fullWidth onChange={setColor} color={color} allowAlpha />
                                    {/* <Button primary submit>Generate</Button> */}
                                </FormLayout>
                            </Form>
                        </Card.Section>
                    </Card>
                </Layout.Section>
                {
                    res === '' ? (
                        <Layout.Section oneThird>
                            <Card title="Real Time View">
                                <Card.Section>
                                    <div className="realtimeview flex justify-center items-center overflow-hidden">
                                        <span className="typedQuote" style={{ color: `hsla(${cl[0]}, ${cl[1] * 100}%, ${cl[2] * 100}%, ${cl[3]})` }} >{quote}</span>
                                    </div>
                                </Card.Section>
                            </Card>
                        </Layout.Section>
                    ) : isLoading ? 'Generating Image..' : (
                        <Layout.Section oneThird>
                            <Card title="Generated Image">
                                <Card.Section>
                                    <img src={res.image} style={{ width: '100%', marginBottom: '10px' }} alt="pic" />
                                    <Button onClick={() => window.open(`${serverUrl}/${res.imgPath}.png`, '_blank')} primary>Download PNG</Button>
                                </Card.Section>
                            </Card>
                        </Layout.Section>
                    )
                }
            </Layout>
        </div >
    )
}

export default Home